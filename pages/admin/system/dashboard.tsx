import ChecklistIcon from '@mui/icons-material/Checklist';
// import PieChartSystem from '@/components/Admin/school/chart/PieChartSystem';
import BarChartSystem from '@/components/Admin/school/chart/BarChatSystem';

const Home = () => {
  const labels = ['Tài khoản doanh nghiệp', 'Trường học', 'Workshop', 'Job'];

  const dataValues = [
    [10, 5, 2],
    [8, 6, 4],
    [12, 3, 2],
    [15, 2, 1],
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
        <div style={{ padding: '20px', marginTop: '20px' }}>
          <h2 className="text-center text-xl font-semibold">Biểu đồ trạng thái tổng hợp</h2>
          <BarChartSystem labels={labels} dataValues={dataValues} />
        </div>
      </div>
    </div>
  );
};

export default Home;
