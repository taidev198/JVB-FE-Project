import Image from 'next/image';
import Confetti from 'react-confetti';
import { Button } from '@/components/Common/Button';
import happy from '@/assets/images/feeling_happy.png';
import error from '@/assets/images/feeling_red.png';

const Confirm = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-10 rounded-lg p-16 shadow-lg">
        <Confetti height={999} />
        <Image src={happy} alt="aaa" width={100} height={100} />
        <h1 className="text-2xl font-bold">Xác nhận tài khoản thành công</h1>
        <p className="text-lg">Vui lòng chờ quản trị viên phê duyệt</p>
        <Button text="Quay về trang chủ" />
      </div>
      <div className="flex flex-col items-center justify-center gap-10 rounded-lg p-16 shadow-lg">
        <Image src={error} alt="aaa" width={100} height={100} />
        <h1 className="text-2xl font-bold">Xác nhận tài khoản thất bại</h1>
        <p className="text-lg">Vui lòng thử l.ại</p>
        <Button text="Quay về trang chủ" />
      </div>
    </div>
  );
};
export default Confirm;
