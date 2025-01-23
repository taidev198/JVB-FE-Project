import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  dataValues: number[];
}

const BarChart: React.FC<BarChartProps> = ({ labels, dataValues }) => {
  const colors = ['#F6EAC2', '#FFD8BE', '#8FCACA', '#CCE2CB', '#CBAACB'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Số liệu',
        data: dataValues,
        backgroundColor: dataValues.map((_, index) => colors[index % colors.length]), // Mỗi cột có một màu
        borderColor: 'white',
        borderWidth: 1,
        barThickness: 100,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Biểu đồ cột',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '1200px', height: '500px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
