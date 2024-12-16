import Image from 'next/image';
import { useDispatch } from 'react-redux';
import Confetti from 'react-confetti';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/Common/Button';
import happy from '@/assets/images/feeling_happy.png';
import error from '@/assets/images/feeling_red.png';
import { useConfirmRegisterQuery } from '@/services/adminSystemApi';
import { setLoading } from '@/store/slices/global';

const Confirm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const uuid = Array.isArray(router.query.uuid) ? router.query.uuid[0] : router.query.uuid || '';

  const { isSuccess, isError, isLoading } = useConfirmRegisterQuery({ uuid });
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {isSuccess && (
        <div className="flex flex-col items-center justify-center gap-10 rounded-lg p-16 shadow-lg">
          <Confetti height={999} />
          <Image src={happy} alt="aaa" width={100} height={100} />
          <h1 className="text-2xl font-bold">Xác nhận tài khoản thành công</h1>
          <p className="text-lg">Vui lòng chờ quản trị viên phê duyệt</p>
          <Link href={'http://localhost:3000/'}>
            <Button text="Quay về trang chủ" />
          </Link>
        </div>
      )}
      {(isError || !uuid) && (
        <div className="flex flex-col items-center justify-center gap-10 rounded-lg p-16 shadow-lg">
          <Image src={error} alt="aaa" width={100} height={100} />
          <h1 className="text-2xl font-bold">Xác nhận tài khoản thất bại !</h1>
          <p className="text-lg">Vui lòng thử lại</p>
          <Link href={'http://localhost:3000/'}>
            <Button text="Quay về trang chủ" />
          </Link>
        </div>
      )}
    </div>
  );
};
export default Confirm;
