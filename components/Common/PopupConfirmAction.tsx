import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { FC } from 'react';
import { BackDrop } from './BackDrop';
import { Button } from '@/components/Common/Button';
import { setBackdrop } from '@/store/slices/global';

const { TextArea } = Input;

interface PopupConfirmActionProps {
  text: string;
  name: string;
  onClick: () => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  reason?: boolean;
}

const PopupConfirmAction: FC<PopupConfirmActionProps> = ({ text, name, onClick, searchTerm, setSearchTerm, reason = false }) => {
  const dispatch = useDispatch();

  return (
    <BackDrop isCenter>
      <div className="max-w-[430px] rounded-md p-6">
        <div className="mb-3">
          <h3 className="font-bold">
            {text} {name}
          </h3>
          <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
        </div>
        {reason && <TextArea rows={4} placeholder="Nhập lý do" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />}
        <div className="mt-9 flex items-center gap-5">
          <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
          <Button text="Xác nhận" full={true} onClick={onClick} />
        </div>
      </div>
    </BackDrop>
  );
};
export default PopupConfirmAction;
