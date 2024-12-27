import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Yêu cầu đã gửi đi', 'Yêu cầu đã chấp thuận', 'Workshop đã đăng tải', 'Workshop đã được duyệt', 'Workshop doanh nghiệp đã apply'],
  datasets: [
    {
      label: 'Số lượng',
      data: [40, 16, 20, 7, 10],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const DashboardSchool = () => {
  return (
    <div>
      <h2>Biểu đồ cột tổng quan</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardSchool;
