import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartCompanyProps {
  labels: string[];
  dataValues: number[][];
}

const BarChartCompany: React.FC<BarChartCompanyProps> = ({ labels, dataValues }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Chờ xử lý',
        data: dataValues[0],
        backgroundColor: 'pink',
      },
      {
        label: 'Chấp nhận/Duyệt',
        data: dataValues[1],
        backgroundColor: 'green',
      },
      {
        label: 'Từ chối',
        data: dataValues[2],
        backgroundColor: 'red',
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
        text: 'Biểu đồ trạng thái tổng hợp', // Tiêu đề cho biểu đồ
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
      },
    },
  };

  return (
    <div style={{ width: '800px', height: '500px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartCompany;
