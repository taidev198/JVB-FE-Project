import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(ArcElement, Tooltip, Legend);

// Kiểu dữ liệu cho biểu đồ
interface PieChartSystemProps {
  labels: string[];
  dataValues: number[];
}

const PieChartSystem: React.FC<PieChartSystemProps> = ({ labels, dataValues }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Số lượng trạng thái',
        data: dataValues,
        backgroundColor: ['#FFA500', '#32CD32', '#FF6347'], // Màu sắc cho từng trạng thái
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép tùy chỉnh tỷ lệ
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartSystem;
