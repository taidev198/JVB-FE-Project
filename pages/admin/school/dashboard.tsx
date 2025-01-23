import ChecklistIcon from '@mui/icons-material/Checklist';
import PieChart from '@/components/Admin/school/chart/PieChart';
import BarChart from '@/components/Admin/school/chart/BarChart';

const AdminSchoolDashboard = () => {
  const labels = ['Đang chờ', 'Đã duyệt', 'Từ chối'];
  const dataValues = [50, 30, 20];
  const barChartLabels = [
    'Số yêu cầu liên kết đã được chấp thuận',
    'Số yêu cầu liên kết đã gửi đi',
    'Số workshop đã đăng tải',
    'Số workshop đã được duyệt',
    'Số workshop Doanh nghiệp đã apply',
  ];
  const barChartDataValues = [16, 40, 20, 7, 20];
  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className="text-2xl font-semibold">Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2 xl:grid-cols-4">
        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">16+</span>
            <span>Số yêu cầu liên kết đã được chấp thuận</span>
          </div>
        </div>

        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">40+</span>
            <span>Số yêu cầu liên kết đã gửi đi</span>
          </div>
        </div>

        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">20+</span>
            <span>Số workshop đã đăng tải</span>
          </div>
        </div>

        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">7+</span>
            <span>Số workshop đã được duyệt</span>
          </div>
        </div>
        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">20+</span>
            <span>Số workshop Doanh nghiệp đã apply</span>
          </div>
        </div>
      </div>
      <div className=" bg-white">
        {/* Thêm biểu đồ trạng thái */}
        <div style={{ padding: '20px' }} className="mt-20">
          <h2 className="mb-10 text-center text-xl font-semibold">Biểu đồ trạng thái</h2>
          <PieChart labels={labels} dataValues={dataValues} />
        </div>
        {/* Biểu đồ cột */}
        <div className="mb-10 ml-20 mt-20">
          <h2 className="text-center text-xl font-semibold">Biểu đồ số lượng yêu cầu</h2>
          <BarChart labels={barChartLabels} dataValues={barChartDataValues} />
        </div>
      </div>
    </div>
  );
};

export default AdminSchoolDashboard;
