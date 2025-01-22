import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import OTPInput from 'react-otp-input';
import * as yup from 'yup';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { useCheckWalletMutation, useCreateWalletMutation } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';

interface CreateWalletDialogProps {
  open: boolean;
  onSuccess: () => void; // Callback để xử lý khi ví được tạo thành công
  isWallet?: boolean;
  handleCancel: () => void;
}

const pinSchema = yup
  .string()
  .matches(/^[0-9]+$/, 'Mã pin chỉ được chứa số từ 0-9.')
  .length(6, 'Mã pin phải có độ dài là 6 chữ số.')
  .required('Mã pin là bắt buộc.');

const RechargeDialog: React.FC<CreateWalletDialogProps> = ({ open, onSuccess, handleCancel, isWallet }) => {
  const idAccount = useAppSelector(state => state.user.idAccount);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [createWallet, { isSuccess, error }] = useCreateWalletMutation();
  const [checkPinCode, { isSuccess: isSuccessCheck, error: errorCheck }] = useCheckWalletMutation();

  const validatePin = async (pin: string) => {
    try {
      await pinSchema.validate(pin);
      setPinError(null);
      return true;
    } catch (error) {
      setPinError(error.errors[0]);
      return false;
    }
  };

  const handleCreateWalletSubmit = async () => {
    try {
      const isValidPin = await validatePin(pin);
      if (!isValidPin) return;

      if (isWallet) {
        await checkPinCode({ idAccount: idAccount, pinCode: pin }).unwrap();
      } else {
        await createWallet({ idAccount: idAccount, pinCode: pin }).unwrap();
      }
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Tạo ví thành công');
      onSuccess();
    }
    if (error) {
      toast.error('Tạo ví thất bại');
    }
  }, [isSuccess, error, onSuccess]);

  useEffect(() => {
    if (isSuccessCheck) {
      toast.success('Mã Pin hợp lệ');
      onSuccess();
    }
    if (errorCheck) {
      toast.error('Mã Pin không hợp lệ');
    }
  }, [isSuccessCheck, errorCheck, onSuccess]);

  const onPinChange = async (value: string): Promise<void> => {
    setPin(value);
    await validatePin(value);
  };

  return (
    open && (
      <BackDrop isCenter>
        <div className="max-w-[430px] rounded-md p-6">
          <div className="mb-3">
            <h3 className="font-bold">Nhập mã pin</h3>
            <p className="mt-1">Hãy nhập mã pin để thực hiện tạo một ví của bạn?</p>
          </div>
          <div className="m-auto flex flex-col items-center justify-around gap-2">
            <OTPInput
              value={pin}
              onChange={onPinChange}
              numInputs={6}
              renderInput={props => <input {...props} type="text" />}
              inputStyle={{
                width: 55,
                height: 60,
                backgroundColor: '#ebebe928',
                borderRadius: 10,
                border: pinError ? '1px solid red' : '1px solid #ccc',
              }}
              containerStyle={{
                justifyContent: 'space-around',
                gap: '8px',
              }}
            />
            {pinError && <p className="mt-[2px] text-[13px] text-red-500">{pinError}</p>}
          </div>
          <div className="mt-9 flex items-center gap-5">
            <Button text="Hủy" className="bg-red-600" full={true} onClick={handleCancel} />
            <Button text="Xác nhận" full={true} onClick={handleCreateWalletSubmit} />
          </div>
        </div>
      </BackDrop>
    )
  );
};

export default RechargeDialog;
