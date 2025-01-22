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
        backgroundColor: '#FEE1E8',
        borderColor: 'pink',
        borderWidth: 1,
      },
      {
        label: 'Chấp nhận/Duyệt',
        data: dataValues[1],
        backgroundColor: '#B5E7A0',
        borderColor: 'green',
        borderWidth: 1,
      },
      {
        label: 'Từ chối',
        data: dataValues[2],
        backgroundColor: '#FF968A',
        borderColor: 'red',
        borderWidth: 1,
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
