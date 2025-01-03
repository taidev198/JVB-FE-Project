import { useDispatch } from 'react-redux';
import { FC } from 'react';
import { BackDrop } from './BackDrop';
import { Button } from '@/components/Common/Button';
import { setBackdrop } from '@/store/slices/global';

interface PopupConfirmActionProps {
  text: string;
  name: string;
  onClick: () => void;
}

const PopupConfirmAction: FC<PopupConfirmActionProps> = ({ text, name, onClick }) => {
  const dispatch = useDispatch();
  return (
    <BackDrop isCenter>
      <div className="max-w-[430px] rounded-md p-6">
        <h3 className="font-bold">
          {text} {name}
        </h3>
        <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
        <div className="mt-9 flex items-center gap-5">
          <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
          <Button text="Xác nhận" full={true} onClick={onClick} />
        </div>
      </div>
    </BackDrop>
  );
};
export default PopupConfirmAction;
