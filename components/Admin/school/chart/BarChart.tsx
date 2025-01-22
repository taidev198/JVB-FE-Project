import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  dataValues: number[];
}

const BarChart: React.FC<BarChartProps> = ({ labels, dataValues }) => {
  const colors = ['pink', '#36A2EB', '#FFCE56', 'green', '#FF9F40', '#FFCD56', '#FFB6C1', '#FFA07A'];

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
    responsive: true, // Biểu đồ sẽ tự động điều chỉnh kích thước theo màn hình
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Biểu đồ cột', // Tiêu đề cho biểu đồ
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
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
