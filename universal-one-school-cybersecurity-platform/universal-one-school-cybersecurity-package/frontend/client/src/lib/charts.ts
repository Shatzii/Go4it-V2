import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const chartColors = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#10B981',
  background: {
    critical: 'rgba(239, 68, 68, 0.1)',
    high: 'rgba(245, 158, 11, 0.1)',
    medium: 'rgba(59, 130, 246, 0.1)',
    low: 'rgba(16, 185, 129, 0.1)',
  }
};

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1B263B',
      titleColor: '#FFFFFF',
      bodyColor: '#9CA3AF',
      borderColor: '#374151',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: '#374151',
        borderColor: '#374151',
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: '#374151',
        borderColor: '#374151',
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 12,
        },
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
    line: {
      tension: 0.4,
    },
  },
};

export function generateThreatChartData() {
  const hours = Array.from({ length: 7 }, (_, i) => {
    const hour = (new Date().getHours() - 6 + i) % 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return {
    labels: hours,
    datasets: [
      {
        label: 'Critical',
        data: hours.map(() => Math.floor(Math.random() * 15) + 1),
        borderColor: chartColors.critical,
        backgroundColor: chartColors.background.critical,
        fill: true,
      },
      {
        label: 'High',
        data: hours.map(() => Math.floor(Math.random() * 25) + 5),
        borderColor: chartColors.high,
        backgroundColor: chartColors.background.high,
        fill: true,
      },
      {
        label: 'Medium',
        data: hours.map(() => Math.floor(Math.random() * 35) + 10),
        borderColor: chartColors.medium,
        backgroundColor: chartColors.background.medium,
        fill: true,
      },
    ],
  };
}

export function createThreatChartOptions() {
  return {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };
}

export function generateAnomalyScoreData(score: number) {
  return {
    labels: ['Security Score'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          score >= 80 ? chartColors.low : score >= 60 ? chartColors.high : chartColors.critical,
          '#2D3748',
        ],
        borderWidth: 0,
      },
    ],
  };
}

export function createDonutChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1B263B',
        titleColor: '#FFFFFF',
        bodyColor: '#9CA3AF',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    cutout: '70%',
  };
}
