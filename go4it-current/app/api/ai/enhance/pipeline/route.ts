import { NextRequest, NextResponse } from 'next/server';

interface DataPipeline {
  id: string;
  name: string;
  description: string;
  schedule: string; // cron expression
  source: {
    type: 'database' | 'api' | 'file' | 'webhook';
    config: any;
  };
  transforms: Array<{
    type: 'filter' | 'aggregate' | 'join' | 'map' | 'reduce';
    config: any;
  }>;
  destination: {
    type: 'database' | 'api' | 'file' | 'email' | 'slack';
    config: any;
  };
  notifications: {
    onSuccess?: string[];
    onFailure?: string[];
    alerts?: Array<{
      condition: string;
      channels: string[];
      message: string;
    }>;
  };
}

const SAMPLE_PIPELINES: DataPipeline[] = [
  {
    id: 'daily-athlete-analytics',
    name: 'Daily Athlete Performance Analytics',
    description: 'Aggregate daily athlete performance metrics and generate insights',
    schedule: '0 6 * * *', // Daily at 6 AM
    source: {
      type: 'database',
      config: {
        table: 'athlete_metrics',
        query: 'SELECT * FROM athlete_metrics WHERE date >= CURRENT_DATE - INTERVAL \'1 day\''
      }
    },
    transforms: [
      {
        type: 'aggregate',
        config: {
          groupBy: ['athlete_id', 'sport'],
          aggregations: {
            avg_performance: 'AVG(performance_score)',
            max_performance: 'MAX(performance_score)',
            session_count: 'COUNT(*)',
            improvement_rate: 'AVG(improvement_percentage)'
          }
        }
      },
      {
        type: 'filter',
        config: {
          condition: 'session_count >= 3'
        }
      }
    ],
    destination: {
      type: 'database',
      config: {
        table: 'daily_analytics',
        operation: 'upsert'
      }
    },
    notifications: {
      alerts: [
        {
          condition: 'improvement_rate < 0',
          channels: ['slack', 'email'],
          message: '⚠️ Athlete performance declining: {athlete_name} shows negative improvement trend'
        }
      ]
    }
  },
  {
    id: 'weekly-revenue-report',
    name: 'Weekly Revenue Analytics',
    description: 'Generate weekly revenue reports and financial insights',
    schedule: '0 8 * * 1', // Weekly on Monday at 8 AM
    source: {
      type: 'database',
      config: {
        table: 'transactions',
        query: 'SELECT * FROM transactions WHERE created_at >= CURRENT_DATE - INTERVAL \'7 days\''
      }
    },
    transforms: [
      {
        type: 'aggregate',
        config: {
          groupBy: ['DATE(created_at)', 'product_type'],
          aggregations: {
            revenue: 'SUM(amount)',
            transactions: 'COUNT(*)',
            avg_transaction: 'AVG(amount)'
          }
        }
      },
      {
        type: 'reduce',
        config: {
          operation: 'sum',
          fields: ['revenue', 'transactions']
        }
      }
    ],
    destination: {
      type: 'email',
      config: {
        recipients: ['finance@go4itsports.org', 'management@go4itsports.org'],
        subject: 'Weekly Revenue Report - {week_start} to {week_end}',
        template: 'weekly_revenue_template'
      }
    },
    notifications: {
      onSuccess: ['slack#finance'],
      alerts: [
        {
          condition: 'revenue < 50000',
          channels: ['slack', 'email'],
          message: '🚨 Weekly revenue below target: ${revenue} (Target: $50,000)'
        }
      ]
    }
  },
  {
    id: 'lead-nurture-automation',
    name: 'Lead Nurture Campaign Automation',
    description: 'Automatically nurture leads through email sequences based on behavior',
    schedule: '*/30 * * * *', // Every 30 minutes
    source: {
      type: 'database',
      config: {
        table: 'leads',
        query: 'SELECT * FROM leads WHERE status = \'new\' AND last_contacted_at < CURRENT_TIMESTAMP - INTERVAL \'24 hours\''
      }
    },
    transforms: [
      {
        type: 'map',
        config: {
          field: 'segment',
          mapping: {
            'parent': 'parent_sequence',
            'athlete': 'athlete_sequence',
            'coach': 'coach_sequence',
            'sponsor': 'sponsor_sequence'
          }
        }
      },
      {
        type: 'filter',
        config: {
          condition: 'email_opt_in = true'
        }
      }
    ],
    destination: {
      type: 'api',
      config: {
        url: 'https://api.sendgrid.com/v3/mail/send',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {SENDGRID_API_KEY}',
          'Content-Type': 'application/json'
        },
        template: true
      }
    },
    notifications: {
      onSuccess: ['slack#marketing']
    }
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pipelineId = searchParams.get('id');

  if (pipelineId) {
    const pipeline = SAMPLE_PIPELINES.find(p => p.id === pipelineId);
    if (!pipeline) {
      return NextResponse.json(
        { error: `Pipeline not found: ${pipelineId}` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, pipeline });
  }

  return NextResponse.json({
    success: true,
    pipelines: SAMPLE_PIPELINES.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      schedule: p.schedule
    }))
  });
}

export async function POST(request: NextRequest) {
  try {
    const { pipelineId, executeNow = false, parameters = {} } = await request.json();

    if (!pipelineId) {
      return NextResponse.json(
        { error: 'Missing required parameter: pipelineId' },
        { status: 400 }
      );
    }

    const pipeline = SAMPLE_PIPELINES.find(p => p.id === pipelineId);
    if (!pipeline) {
      return NextResponse.json(
        { error: `Pipeline not found: ${pipelineId}` },
        { status: 404 }
      );
    }

    if (executeNow) {
      // Execute pipeline immediately
      const result = await executePipeline(pipeline, parameters);
      return NextResponse.json({
        success: true,
        pipeline: pipelineId,
        execution: result,
        executedAt: new Date().toISOString()
      });
    } else {
      // Schedule pipeline (in a real implementation, this would use a job scheduler)
      return NextResponse.json({
        success: true,
        pipeline: pipelineId,
        scheduled: true,
        nextRun: calculateNextRun(pipeline.schedule),
        message: 'Pipeline scheduled for execution'
      });
    }

  } catch (error) {
    console.error('Pipeline execution error:', error);
    return NextResponse.json(
      { error: 'Internal server error during pipeline execution' },
      { status: 500 }
    );
  }
}

async function executePipeline(pipeline: DataPipeline, parameters: any) {
  try {
    // Extract data from source
    const rawData = await extractData(pipeline.source, parameters);

    // Apply transformations
    let processedData = rawData;
    for (const transform of pipeline.transforms) {
      processedData = await applyTransform(processedData, transform);
    }

    // Load data to destination
    const loadResult = await loadData(processedData, pipeline.destination);

    // Check alerts and send notifications
    await checkAlerts(processedData, pipeline.notifications);

    return {
      status: 'success',
      recordsProcessed: processedData.length,
      destination: loadResult,
      alertsTriggered: 0 // Would be calculated in real implementation
    };

  } catch (error) {
    console.error(`Pipeline ${pipeline.id} execution failed:`, error);

    // Send failure notifications
    if (pipeline.notifications.onFailure) {
      await sendNotifications(pipeline.notifications.onFailure, {
        pipeline: pipeline.name,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    throw error;
  }
}

async function extractData(source: any, parameters: any) {
  switch (source.type) {
    case 'database':
      // In a real implementation, this would connect to your database
      return await mockDatabaseQuery(source.config, parameters);

    case 'api':
      const response = await fetch(source.config.url, {
        method: source.config.method || 'GET',
        headers: source.config.headers || {},
        body: source.config.body ? JSON.stringify(source.config.body) : undefined
      });
      return await response.json();

    case 'file':
      // Would read from file system or cloud storage
      return [];

    default:
      throw new Error(`Unsupported source type: ${source.type}`);
  }
}

async function applyTransform(data: any[], transform: any) {
  switch (transform.type) {
    case 'filter':
      return data.filter(item => evaluateCondition(item, transform.config.condition));

    case 'aggregate':
      return performAggregation(data, transform.config);

    case 'map':
      return data.map(item => applyMapping(item, transform.config));

    case 'join':
      // Would implement join logic
      return data;

    default:
      return data;
  }
}

async function loadData(data: any[], destination: any) {
  switch (destination.type) {
    case 'database':
      // Would insert/update database
      return { table: destination.config.table, records: data.length };

    case 'api':
      const response = await fetch(destination.config.url, {
        method: destination.config.method || 'POST',
        headers: destination.config.headers || {},
        body: JSON.stringify(data)
      });
      return { status: response.status, success: response.ok };

    case 'email':
      // Would send email with data
      return { recipients: destination.config.recipients, sent: true };

    default:
      return { type: destination.type, processed: true };
  }
}

async function checkAlerts(data: any[], notifications: any) {
  if (!notifications.alerts) return;

  for (const alert of notifications.alerts) {
    const triggered = data.some(item => evaluateCondition(item, alert.condition));
    if (triggered) {
      await sendNotifications(alert.channels, {
        message: alert.message,
        data: data.slice(0, 5), // Sample of triggering data
        timestamp: new Date().toISOString()
      });
    }
  }
}

async function sendNotifications(channels: string[], data: any) {
  // Implementation would send to Slack, email, etc.
  console.log('Sending notifications to:', channels, 'with data:', data);
}

// Helper functions
function evaluateCondition(item: any, condition: string): boolean {
  // Simple condition evaluation - would use a proper expression parser in production
  try {
    // Replace field references with actual values
    let processedCondition = condition;
    Object.keys(item).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      processedCondition = processedCondition.replace(regex, `item.${key}`);
    });

    const evaluate = new Function('item', `return ${processedCondition};`);
    return Boolean(evaluate(item));
  } catch (error) {
    console.error('Condition evaluation error:', error);
    return false;
  }
}

function performAggregation(data: any[], config: any) {
  const groups: Record<string, any[]> = {};

  // Group data
  data.forEach(item => {
    const key = config.groupBy.map((field: string) => item[field]).join('|');
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  // Apply aggregations
  return Object.entries(groups).map(([key, items]) => {
    const result: any = {};

    // Restore group by fields
    const keyParts = key.split('|');
    config.groupBy.forEach((field: string, index: number) => {
      result[field] = keyParts[index];
    });

    // Apply aggregations
    Object.entries(config.aggregations).forEach(([alias, expression]) => {
      result[alias] = calculateAggregation(items, expression as string);
    });

    return result;
  });
}

function calculateAggregation(items: any[], expression: string): number {
  // Simple aggregation functions - would be more sophisticated in production
  if (expression.startsWith('COUNT(')) return items.length;
  if (expression.startsWith('SUM(')) {
    const field = expression.match(/SUM\(([^)]+)\)/)?.[1];
    return items.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0);
  }
  if (expression.startsWith('AVG(')) {
    const field = expression.match(/AVG\(([^)]+)\)/)?.[1];
    const sum = items.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0);
    return sum / items.length;
  }
  if (expression.startsWith('MAX(')) {
    const field = expression.match(/MAX\(([^)]+)\)/)?.[1];
    return Math.max(...items.map(item => parseFloat(item[field]) || 0));
  }
  if (expression.startsWith('MIN(')) {
    const field = expression.match(/MIN\(([^)]+)\)/)?.[1];
    return Math.min(...items.map(item => parseFloat(item[field]) || 0));
  }
  return 0;
}

function applyMapping(item: any, config: any) {
  const result = { ...item };
  if (config.field && config.mapping) {
    const currentValue = item[config.field];
    result[config.field] = config.mapping[currentValue] || currentValue;
  }
  return result;
}

async function mockDatabaseQuery(config: any, parameters: any) {
  // Mock data for demonstration - would connect to real database
  return [
    { athlete_id: 1, sport: 'soccer', performance_score: 85, improvement_percentage: 5.2 },
    { athlete_id: 2, sport: 'basketball', performance_score: 92, improvement_percentage: -2.1 },
    { athlete_id: 3, sport: 'soccer', performance_score: 78, improvement_percentage: 8.7 }
  ];
}

function calculateNextRun(cronExpression: string): string {
  // Simple cron parsing - would use a proper cron library in production
  // For now, just return a mock next run time
  const now = new Date();
  now.setHours(now.getHours() + 24); // Next day
  return now.toISOString();
}