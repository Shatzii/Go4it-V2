import { Request, Response } from 'express';
import { systemMonitor } from '../monitoring/systemMonitor';
import { logMonitor } from '../monitoring/logMonitor';
import { terminalExecutor } from '../monitoring/terminalExecutor';

/**
 * Controller for real-time server monitoring and management
 */
export const monitoringController = {
  /**
   * Get current real-time system metrics
   */
  getCurrentMetrics: async (req: Request, res: Response) => {
    try {
      const metrics = await systemMonitor.getCurrentMetrics();
      res.json({ success: true, metrics });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get system metrics' 
      });
    }
  },

  /**
   * Get performance data for charts
   */
  getPerformanceData: async (req: Request, res: Response) => {
    try {
      const minutes = parseInt(req.query.minutes as string) || 10;
      const performanceData = systemMonitor.getPerformanceData(minutes);
      res.json({ success: true, performanceData });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get performance data' 
      });
    }
  },

  /**
   * Get recent log analysis
   */
  getLogAnalysis: async (req: Request, res: Response) => {
    try {
      const analysis = logMonitor.getLogAnalysis();
      res.json({ success: true, analysis });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get log analysis' 
      });
    }
  },

  /**
   * Get recent log entries
   */
  getRecentLogs: async (req: Request, res: Response) => {
    try {
      const count = parseInt(req.query.count as string) || 100;
      const logs = logMonitor.getRecentLogs(count);
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get recent logs' 
      });
    }
  },

  /**
   * Execute a terminal command
   */
  executeCommand: async (req: Request, res: Response) => {
    try {
      const { command, confirmed = false } = req.body;

      if (!command || typeof command !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: 'Command is required and must be a string' 
        });
      }

      // Check if command requires confirmation
      const requiresConfirmation = terminalExecutor.requiresConfirmation(command);
      
      if (requiresConfirmation && !confirmed) {
        return res.json({
          success: false,
          requiresConfirmation: true,
          message: 'This command requires confirmation due to potential system impact'
        });
      }

      const result = await terminalExecutor.executeCommand(command, confirmed);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to execute command' 
      });
    }
  },

  /**
   * Get command execution history
   */
  getCommandHistory: async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const history = terminalExecutor.getCommandHistory(limit);
      res.json({ success: true, history });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get command history' 
      });
    }
  },

  /**
   * Get command suggestions
   */
  getCommandSuggestions: async (req: Request, res: Response) => {
    try {
      const input = req.query.input as string || '';
      const suggestions = terminalExecutor.getCommandSuggestions(input);
      res.json({ success: true, suggestions });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get command suggestions' 
      });
    }
  },

  /**
   * Get safe commands list
   */
  getSafeCommands: async (req: Request, res: Response) => {
    try {
      const commands = terminalExecutor.getSafeCommands();
      res.json({ success: true, commands });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get safe commands' 
      });
    }
  },

  /**
   * Execute healing commands from AI recommendations
   */
  executeHealingCommands: async (req: Request, res: Response) => {
    try {
      const { commands, autoExecute = false } = req.body;

      if (!Array.isArray(commands)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Commands must be an array' 
        });
      }

      const results = await terminalExecutor.executeHealingCommands(commands, autoExecute);
      res.json({ success: true, results });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to execute healing commands' 
      });
    }
  },

  /**
   * Get system information
   */
  getSystemInfo: async (req: Request, res: Response) => {
    try {
      const systemInfo = await terminalExecutor.getSystemInfo();
      res.json({ success: true, systemInfo });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get system information' 
      });
    }
  },

  /**
   * Start/stop monitoring services
   */
  controlMonitoring: async (req: Request, res: Response) => {
    try {
      const { action, service, interval } = req.body;

      if (!action || !['start', 'stop'].includes(action)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Action must be "start" or "stop"' 
        });
      }

      if (!service || !['system', 'logs', 'both'].includes(service)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Service must be "system", "logs", or "both"' 
        });
      }

      const intervalMs = interval || 5000;

      if (action === 'start') {
        if (service === 'system' || service === 'both') {
          systemMonitor.startMonitoring(intervalMs);
        }
        if (service === 'logs' || service === 'both') {
          await logMonitor.startLogMonitoring(intervalMs * 2); // Log monitoring at half frequency
        }
      } else {
        if (service === 'system' || service === 'both') {
          systemMonitor.stopMonitoring();
        }
        if (service === 'logs' || service === 'both') {
          logMonitor.stopLogMonitoring();
        }
      }

      res.json({ 
        success: true, 
        message: `${action === 'start' ? 'Started' : 'Stopped'} ${service} monitoring` 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to control monitoring' 
      });
    }
  },

  /**
   * Get monitoring status
   */
  getMonitoringStatus: async (req: Request, res: Response) => {
    try {
      const status = {
        systemMonitoring: systemMonitor.isMonitoring(),
        logMonitoring: logMonitor.getMonitoredPaths().length > 0,
        monitoredLogPaths: logMonitor.getMonitoredPaths(),
        lastMetrics: systemMonitor.getLatestMetrics(),
        metricsHistorySize: systemMonitor.getMetricsHistory().length
      };

      res.json({ success: true, status });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to get monitoring status' 
      });
    }
  },

  /**
   * Manually analyze a log file
   */
  analyzeLogFile: async (req: Request, res: Response) => {
    try {
      const { filePath, issueDescription } = req.body;

      if (!filePath || typeof filePath !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: 'File path is required and must be a string' 
        });
      }

      await logMonitor.analyzeLogFile(filePath, issueDescription);
      
      res.json({ 
        success: true, 
        message: 'Log file analysis completed successfully' 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to analyze log file' 
      });
    }
  }
};