import ChatLeft from '@/components/Chat/ChatLeft';
import ChatRight from '@/components/Chat/ChatRight';

const Chat = () => {
  return (
    <div className="grid h-screen grid-cols-12 overflow-hidden">
      {/* Bên trái */}
      <div className="hidden overflow-auto border-r border-solid sm:col-span-5 sm:block lg:col-span-4 xl:col-span-3">
        <ChatLeft />
      </div>

      {/* Bên phải */}
      <div className="col-span-12 overflow-auto sm:col-span-7 lg:col-span-8 xl:col-span-9">
        <ChatRight />
      </div>
    </div>
  );
};

export default Chat;
