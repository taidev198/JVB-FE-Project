import ChecklistIcon from '@mui/icons-material/Checklist';

const AdminSchoolDashboard = () => {
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
          <div className="flex flex-col ">
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
    </div>
  );
};

export default AdminSchoolDashboard;
