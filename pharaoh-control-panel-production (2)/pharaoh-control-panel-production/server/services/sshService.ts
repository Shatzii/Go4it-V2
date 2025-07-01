import { Client } from 'ssh2';
import * as fs from 'fs';
import { promisify } from 'util';

export interface SSHConnection {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
}

export interface ServerInfo {
  hostname: string;
  os: string;
  kernel: string;
  architecture: string;
  uptime: string;
  memory: {
    total: string;
    used: string;
    free: string;
  };
  disk: {
    total: string;
    used: string;
    available: string;
  };
  cpu: {
    model: string;
    cores: number;
    usage: number;
  };
}

export class SSHService {
  private connections: Map<string, Client> = new Map();

  async connect(serverId: string, config: SSHConnection): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      
      conn.on('ready', () => {
        this.connections.set(serverId, conn);
        resolve(true);
      });

      conn.on('error', (err) => {
        reject(err);
      });

      const connectionConfig: any = {
        host: config.host,
        port: config.port,
        username: config.username,
      };

      if (config.privateKey) {
        connectionConfig.privateKey = config.privateKey;
        if (config.passphrase) {
          connectionConfig.passphrase = config.passphrase;
        }
      } else if (config.password) {
        connectionConfig.password = config.password;
      }

      conn.connect(connectionConfig);
    });
  }

  async executeCommand(serverId: string, command: string): Promise<CommandResult> {
    const conn = this.connections.get(serverId);
    if (!conn) {
      throw new Error('Server not connected');
    }

    return new Promise((resolve, reject) => {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let stdout = '';
        let stderr = '';

        stream.on('close', (code: number) => {
          resolve({ stdout, stderr, code });
        });

        stream.on('data', (data: Buffer) => {
          stdout += data.toString();
        });

        stream.stderr.on('data', (data: Buffer) => {
          stderr += data.toString();
        });
      });
    });
  }

  async getServerInfo(serverId: string): Promise<ServerInfo> {
    const commands = {
      hostname: 'hostname',
      os: 'cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d \'"\'',
      kernel: 'uname -r',
      architecture: 'uname -m',
      uptime: 'uptime -p',
      meminfo: 'free -h | grep Mem',
      diskinfo: 'df -h / | tail -1',
      cpuinfo: 'lscpu | grep "Model name\\|CPU(s):"',
      cpuusage: 'top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1}\''
    };

    const results = await Promise.all(
      Object.entries(commands).map(async ([key, cmd]) => {
        try {
          const result = await this.executeCommand(serverId, cmd);
          return [key, result.stdout.trim()];
        } catch (error) {
          return [key, ''];
        }
      })
    );

    const data = Object.fromEntries(results);

    // Parse memory info
    const memParts = data.meminfo.split(/\s+/);
    const memory = {
      total: memParts[1] || 'Unknown',
      used: memParts[2] || 'Unknown',
      free: memParts[3] || 'Unknown'
    };

    // Parse disk info
    const diskParts = data.diskinfo.split(/\s+/);
    const disk = {
      total: diskParts[1] || 'Unknown',
      used: diskParts[2] || 'Unknown',
      available: diskParts[3] || 'Unknown'
    };

    // Parse CPU info
    const cpuLines = data.cpuinfo.split('\n');
    const cpuModel = cpuLines.find(line => line.includes('Model name'))?.split(':')[1]?.trim() || 'Unknown';
    const cpuCores = parseInt(cpuLines.find(line => line.includes('CPU(s):'))?.split(':')[1]?.trim() || '0');

    return {
      hostname: data.hostname,
      os: data.os,
      kernel: data.kernel,
      architecture: data.architecture,
      uptime: data.uptime,
      memory,
      disk,
      cpu: {
        model: cpuModel,
        cores: cpuCores,
        usage: parseFloat(data.cpuusage) || 0
      }
    };
  }

  async installSoftware(serverId: string, packages: string[]): Promise<CommandResult> {
    // Detect package manager and install packages
    const detectPm = await this.executeCommand(serverId, 'which apt || which yum || which dnf || which pacman');
    
    let installCommand = '';
    if (detectPm.stdout.includes('apt')) {
      installCommand = `sudo apt update && sudo apt install -y ${packages.join(' ')}`;
    } else if (detectPm.stdout.includes('yum')) {
      installCommand = `sudo yum install -y ${packages.join(' ')}`;
    } else if (detectPm.stdout.includes('dnf')) {
      installCommand = `sudo dnf install -y ${packages.join(' ')}`;
    } else if (detectPm.stdout.includes('pacman')) {
      installCommand = `sudo pacman -S --noconfirm ${packages.join(' ')}`;
    } else {
      throw new Error('Unsupported package manager');
    }

    return this.executeCommand(serverId, installCommand);
  }

  async setupWebServer(serverId: string, webServer: 'nginx' | 'apache'): Promise<CommandResult> {
    let commands = '';
    
    if (webServer === 'nginx') {
      commands = `
        sudo apt update
        sudo apt install -y nginx
        sudo systemctl enable nginx
        sudo systemctl start nginx
        sudo ufw allow 'Nginx Full'
      `;
    } else if (webServer === 'apache') {
      commands = `
        sudo apt update
        sudo apt install -y apache2
        sudo systemctl enable apache2
        sudo systemctl start apache2
        sudo ufw allow 'Apache Full'
      `;
    }

    return this.executeCommand(serverId, commands.trim());
  }

  async setupSSL(serverId: string, domain: string): Promise<CommandResult> {
    const commands = `
      sudo apt install -y certbot python3-certbot-nginx
      sudo certbot --nginx -d ${domain} --non-interactive --agree-tos --email admin@${domain}
      sudo systemctl reload nginx
    `;

    return this.executeCommand(serverId, commands.trim());
  }

  async configureFirewall(serverId: string, rules: string[]): Promise<CommandResult> {
    const commands = [
      'sudo ufw --force reset',
      'sudo ufw default deny incoming',
      'sudo ufw default allow outgoing',
      'sudo ufw allow ssh',
      ...rules.map(rule => `sudo ufw allow ${rule}`),
      'sudo ufw --force enable'
    ].join(' && ');

    return this.executeCommand(serverId, commands);
  }

  async setupDatabase(serverId: string, dbType: 'mysql' | 'postgresql' | 'redis'): Promise<CommandResult> {
    let commands = '';

    switch (dbType) {
      case 'mysql':
        commands = `
          sudo apt update
          sudo apt install -y mysql-server
          sudo systemctl enable mysql
          sudo systemctl start mysql
          sudo mysql_secure_installation
        `;
        break;
      case 'postgresql':
        commands = `
          sudo apt update
          sudo apt install -y postgresql postgresql-contrib
          sudo systemctl enable postgresql
          sudo systemctl start postgresql
        `;
        break;
      case 'redis':
        commands = `
          sudo apt update
          sudo apt install -y redis-server
          sudo systemctl enable redis-server
          sudo systemctl start redis-server
        `;
        break;
    }

    return this.executeCommand(serverId, commands.trim());
  }

  async getLogs(serverId: string, service: string, lines: number = 50): Promise<string> {
    const result = await this.executeCommand(serverId, `sudo journalctl -u ${service} -n ${lines} --no-pager`);
    return result.stdout;
  }

  async getMetrics(serverId: string): Promise<any> {
    const commands = {
      cpu: 'top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1}\'',
      memory: 'free | grep Mem | awk \'{printf "%.1f", $3/$2 * 100.0}\'',
      disk: 'df / | tail -1 | awk \'{printf "%.1f", $3/$2 * 100.0}\'',
      load: 'uptime | awk -F\'load average:\' \'{ print $2 }\' | cut -d, -f1 | sed \'s/^[ \\t]*//\'',
      processes: 'ps aux | wc -l'
    };

    const results = await Promise.all(
      Object.entries(commands).map(async ([key, cmd]) => {
        try {
          const result = await this.executeCommand(serverId, cmd);
          return [key, parseFloat(result.stdout.trim()) || 0];
        } catch (error) {
          return [key, 0];
        }
      })
    );

    return Object.fromEntries(results);
  }

  disconnect(serverId: string): void {
    const conn = this.connections.get(serverId);
    if (conn) {
      conn.end();
      this.connections.delete(serverId);
    }
  }

  disconnectAll(): void {
    for (const [serverId] of this.connections) {
      this.disconnect(serverId);
    }
  }
}

export const sshService = new SSHService();