import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { storage } from '../storage';
import { exec } from 'child_process';
import { log } from '../vite';
import * as crypto from 'crypto';
import * as os from 'os';

// Generate some random IDs for demo
const serverIds = ['server-1', 'server-2', 'server-3'];

// Track active terminal sessions
const activeSessions: Record<string, any> = {};

export class SocketService {
  private io: Server;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private logMonitoringInterval: NodeJS.Timeout | null = null;

  constructor(httpServer: HttpServer) {
    // Initialize Socket.IO server
    this.io = new Server(httpServer, {
      path: '/ws',
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    log('Socket.IO server initialized', 'WebSocket');

    // Set up connection handler
    this.io.on('connection', this.handleConnection.bind(this));

    // Start monitoring services
    this.startMonitoringServices();
  }

  private handleConnection(socket: Socket): void {
    log(`New client connected: ${socket.id}`, 'SocketService');

    // Handle terminal commands
    socket.on('terminal:command', async (data: { serverId: string; command: string }) => {
      try {
        const { serverId, command } = data;
        log(`Received command for server ${serverId}: ${command}`, 'SocketService');

        // In a real implementation, we would use SSH to execute the command on the remote server
        // For demo purposes, we'll just execute it locally with a simulated delay

        // Create a session ID if it doesn't exist
        if (!activeSessions[serverId]) {
          activeSessions[serverId] = {
            id: crypto.randomUUID(),
            lastActivity: Date.now()
          };
        }

        // Update last activity
        activeSessions[serverId].lastActivity = Date.now();

        // Emit the command output after a simulated delay
        setTimeout(() => {
          if (command.trim() === 'exit') {
            socket.emit('terminal:output', {
              serverId,
              output: 'Connection closed.\n'
            });
            delete activeSessions[serverId];
            return;
          }

          // For demo purposes, execute the command locally
          // In a real implementation, this would be executed on the remote server via SSH
          this.executeCommand(command, (error, stdout, stderr) => {
            if (error) {
              socket.emit('terminal:error', {
                serverId,
                error: error.message
              });
              socket.emit('terminal:output', {
                serverId,
                output: `Error: ${error.message}\n`
              });
              return;
            }

            let output = stdout;
            if (stderr) {
              output += stderr;
            }

            socket.emit('terminal:output', {
              serverId,
              output
            });
          });
        }, 200); // Simulate network delay
      } catch (error: any) {
        log(`Error handling terminal command: ${error.message}`, 'SocketService');
        socket.emit('terminal:error', {
          serverId: data.serverId,
          error: error.message
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      log(`Client disconnected: ${socket.id}`, 'SocketService');
    });
  }

  private executeCommand(command: string, callback: (error: Error | null, stdout: string, stderr: string) => void): void {
    // In a real implementation, this would use SSH to execute on the remote server
    // For demo purposes, we're executing it locally
    exec(command, (error, stdout, stderr) => {
      callback(error, stdout, stderr);
    });
  }

  private startMonitoringServices(): void {
    log('Starting real-time monitoring services...', 'PharaohAI');

    // Start system monitoring
    this.monitoringInterval = setInterval(() => {
      this.collectAndBroadcastMetrics();
    }, 5000); // Update every 5 seconds
    log('System monitoring started with 5000ms interval', 'PharaohAI');

    // Start log monitoring
    this.logMonitoringInterval = setInterval(() => {
      this.collectAndBroadcastLogs();
    }, 10000); // Update every 10 seconds
    log('Log monitoring started with 10000ms interval', 'PharaohAI');

    log('Real-time monitoring system activated!', 'PharaohAI');
  }

  private collectAndBroadcastMetrics(): void {
    // In a real implementation, this would collect metrics from actual connected servers
    // For demo purposes, we'll generate random metrics

    for (const serverId of serverIds) {
      const metrics = this.generateRandomMetrics();
      
      // Broadcast metrics to all connected clients
      this.io.emit('server:metrics', {
        serverId,
        metrics
      });

      // Store metrics in database for historical data
      try {
        storage.createServerMetric({
          serverId,
          userId: 'demo-user',
          name: 'System Metrics',
          status: metrics.cpu > 80 ? 'critical' : metrics.cpu > 60 ? 'attention' : 'healthy',
          value: `CPU: ${metrics.cpu}%, MEM: ${metrics.memory}%, DISK: ${metrics.disk}%`,
          change: `${Math.floor(Math.random() * 10) - 5}%`
        }).catch(err => {
          log(`Error storing metrics: ${err.message}`, 'SocketService');
        });
      } catch (error: any) {
        log(`Error storing metrics: ${error.message}`, 'SocketService');
      }
    }
  }

  private collectAndBroadcastLogs(): void {
    // In a real implementation, this would collect logs from actual connected servers
    // For demo purposes, we'll generate random log events

    for (const serverId of serverIds) {
      // Only broadcast logs occasionally to avoid spam
      if (Math.random() > 0.3) continue;

      const logEvent = this.generateRandomLogEvent(serverId);
      
      // Broadcast log event to all connected clients
      this.io.emit('server:log', {
        serverId,
        log: logEvent
      });

      // Store log in database
      try {
        storage.createSystemLog({
          serverId,
          userId: 'demo-user',
          level: logEvent.level,
          message: logEvent.message,
          source: logEvent.source
        }).catch(err => {
          log(`Error storing log: ${err.message}`, 'SocketService');
        });
      } catch (error: any) {
        log(`Error storing log: ${error.message}`, 'SocketService');
      }
    }
  }

  private generateRandomMetrics() {
    // Generate realistic-looking server metrics
    const currentLoad = Math.floor(Math.random() * 100);
    
    return {
      cpu: currentLoad,
      memory: Math.floor(Math.random() * 100),
      disk: 70 + Math.floor(Math.random() * 20), // Usually high
      uptime: Math.floor(Math.random() * 30 * 24 * 3600), // Up to 30 days in seconds
      processes: 100 + Math.floor(Math.random() * 150),
      temperature: 40 + Math.floor(Math.random() * 20), // 40-60°C
      network: {
        in: Math.floor(Math.random() * 100000), // bytes/sec
        out: Math.floor(Math.random() * 50000)  // bytes/sec
      },
      load: {
        '1m': (currentLoad / 100 * os.cpus().length).toFixed(2),
        '5m': ((currentLoad - 5 + Math.random() * 10) / 100 * os.cpus().length).toFixed(2),
        '15m': ((currentLoad - 10 + Math.random() * 20) / 100 * os.cpus().length).toFixed(2),
      },
      timestamp: new Date()
    };
  }

  private generateRandomLogEvent(serverId: string) {
    const levels = ['info', 'warning', 'error', 'debug'];
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    const sources = ['system', 'application', 'security', 'network'];
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    let message = '';
    
    switch (source) {
      case 'system':
        message = this.getRandomSystemLogMessage();
        break;
      case 'application':
        message = this.getRandomApplicationLogMessage();
        break;
      case 'security':
        message = this.getRandomSecurityLogMessage();
        break;
      case 'network':
        message = this.getRandomNetworkLogMessage();
        break;
    }
    
    return {
      id: crypto.randomUUID(),
      serverId,
      level,
      source,
      message,
      timestamp: new Date()
    };
  }

  private getRandomSystemLogMessage(): string {
    const messages = [
      'System started',
      'System shutdown initiated',
      'CPU throttling detected due to high temperature',
      'Memory usage threshold exceeded',
      'Disk space running low',
      'Scheduled system maintenance started',
      'System update available',
      'Service restarted successfully',
      'Background task completed',
      'Cron job executed successfully'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomApplicationLogMessage(): string {
    const messages = [
      'Application started successfully',
      'Database connection established',
      'API request processed successfully',
      'Cache rebuilt',
      'Task queue processed 100 items',
      'Background job completed in 5.2s',
      'Memory leak detected in module XYZ',
      'Request took longer than expected: 3.5s',
      'User session expired',
      'Configuration reloaded'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomSecurityLogMessage(): string {
    const messages = [
      'Failed login attempt for user admin',
      'New user account created',
      'Password changed for user john.doe',
      'API key rotated',
      'Suspicious activity detected from IP 192.168.1.1',
      'Firewall rule updated',
      'Permission granted to user alice for resource X',
      'Certificate expiring in 30 days',
      'Rate limit exceeded for API endpoint /api/users',
      'SSH key added for user deployment'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomNetworkLogMessage(): string {
    const messages = [
      'Network interface eth0 up',
      'Connection established to remote server',
      'DNS resolution failed for domain example.com',
      'HTTP 503 error from external API',
      'Network bandwidth spike detected',
      'Latency increased to 250ms on external API calls',
      'SSL handshake failed',
      'Packet loss detected on main connection',
      'Load balancer added new node',
      'Network scan detected from external IP'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  public shutdown(): void {
    // Clear monitoring intervals
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.logMonitoringInterval) {
      clearInterval(this.logMonitoringInterval);
      this.logMonitoringInterval = null;
    }
    
    // Close all connections
    this.io.close();
    
    log('Socket service shut down', 'SocketService');
  }
}

// Singleton instance
let socketService: SocketService | null = null;

export function initializeSocketService(httpServer: HttpServer): SocketService {
  if (!socketService) {
    socketService = new SocketService(httpServer);
  }
  return socketService;
}

export function getSocketService(): SocketService | null {
  return socketService;
}