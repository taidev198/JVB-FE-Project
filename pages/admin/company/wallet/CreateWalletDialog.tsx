/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React from 'react';
import { useRouter } from 'next/router';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';

const CreateWalletDialog = ({ open, onSubmit }) => {
  const router = useRouter();
 

  const handleCancel = () => {
    router.back();
  };

  return (
    open && <BackDrop isCenter>
      <div className="max-w-[430px] rounded-md p-6">
        <div className="mb-3">
          <h3 className="font-bold">Thêm ví mới</h3>
          <p className="mt-1">Bạn chưa có ví, bạn có muốn tạo một ví mới không?</p>
        </div>
        <div className="mt-9 flex items-center gap-5">
          <Button text="Hủy" className="bg-red-600" full={true} onClick={handleCancel} />
          <Button text="Xác nhận" full={true} onClick={onSubmit} />
        </div>
      </div>
    </BackDrop>
  );
};

export default CreateWalletDialog;
