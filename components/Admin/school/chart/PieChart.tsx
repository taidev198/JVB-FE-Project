import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(ArcElement, Tooltip, Legend);

// Kiểu dữ liệu cho biểu đồ
interface PieChartProps {
  labels: string[];
  dataValues: number[];
}

const PieChart: React.FC<PieChartProps> = ({ labels, dataValues }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Số lượng trạng thái',
        data: dataValues,
        backgroundColor: ['#FFD8BE', '#8FCACA', '#FFFFB5'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div style={{ width: '500px', height: '400px', margin: '0 auto' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
