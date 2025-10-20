import { memo } from 'react';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import {
  Legend,
  Tooltip,
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

type Point = { t: number; v: number };

type Props = {
  percentPoints: Point[];
  usageMBPoints: Point[];
  limitMB?: number;
};

function MemoryChartBase({ percentPoints, usageMBPoints }: Props) {
  const data = {
    labels: percentPoints.map((p) => p.t),
    datasets: [
      {
        label: 'Memória (%)',
        data: percentPoints.map((p) => p.v),
        borderWidth: 2,
        borderColor: '#ff4d4d',
        backgroundColor: '#ff4d4d',
        pointRadius: 3,
        tension: 0.25,
        fill: true,
        pointHoverRadius: 5,
      },
      {
        label: 'Uso (MB)',
        data: usageMBPoints.map((p) => p.v),
        borderWidth: 2,
        borderColor: '#4dff4d',
        backgroundColor: '#4dff4d',
        pointRadius: 3,
        tension: 0.25,
        fill: true,
        pointHoverRadius: 5,
        yAxisID: 'y1',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ctx.dataset.yAxisID === 'y1'
              ? `Uso: ${ctx.parsed.y.toFixed(1)} MB`
              : `Mem: ${ctx.parsed.y.toFixed(1)}%`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'second', tooltipFormat: 'HH:mm:ss', displayFormats: { second: 'HH:mm:ss' } },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          autoSkipPadding: 20,
          maxTicksLimit: 8,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        ticks: { callback: (v: any) => `${v}%` },
        grid: { color: 'rgba(255,255,255,0.07)' },
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: { callback: (v: any) => `${v} MB` },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export const MemoryChart = memo(MemoryChartBase);
