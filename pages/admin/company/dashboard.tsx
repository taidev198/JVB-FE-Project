import ChecklistIcon from '@mui/icons-material/Checklist';
import BarChartCompany from '@/components/Admin/school/chart/ChartCompany';

const AdminCompanyDashboard = () => {
  const labels = ['Workshop', 'Công việc', 'Hợp tác'];

  // Dữ liệu cho trạng thái: [Chờ xử lý, Chấp nhận/Duyệt, Từ chối]
  const dataValues = [
    [10, 5, 8], // Workshop: 10 chờ, 5 duyệt, 8 từ chối
    [12, 6, 3], // Công việc: 12 chờ, 6 duyệt, 3 từ chối
    [8, 10, 4], // Hợp tác: 8 chờ, 10 duyệt, 4 từ chối
  ];
  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className="text-2xl font-semibold">Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2 xl:grid-cols-4">
        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">20+</span>
            <span>Công việc</span>
          </div>
        </div>

        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">20+</span>
            <span>Trường Đại Học gửi liên kết</span>
          </div>
        </div>

        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">20+</span>
            <span>Liên kết được chấp nhận</span>
          </div>
        </div>

        <div className="flex w-full items-center gap-[20px] rounded-md bg-primary-white px-5 py-5">
          <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<ChecklistIcon className="text-primary-main" />}</div>
          <div className="flex flex-col ">
            <span className="text-2xl font-bold">20+</span>
            <span>Liên kết gửi đến trường học</span>
          </div>
        </div>
      </div>
      <div className=" bg-white">
        <div style={{ padding: '20px' }} className="mt-20">
          <h2 className="text-center text-xl font-semibold text-green-500">Biểu đồ trạng thái tổng hợp</h2>
          <BarChartCompany labels={labels} dataValues={dataValues} />
        </div>
      </div>
    </div>
  );
};

export default AdminCompanyDashboard;
