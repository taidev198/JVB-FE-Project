/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { showSidebar } from '@/store/slices/global';
import ImageComponent from '@/components/Common/Image';

const SidebarChat = () => {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className=" border-b border-solid bg-white px-0 py-5 sm:px-5">
        <div className="flex items-center rounded-[20px] border border-[#DBDADE] px-[14px]">
          <SearchIcon className="text-[#4B465C]" />
          <input type="text" className="w-[90%] border-none placeholder:text-[15px] placeholder:text-[#4B465C]" placeholder="Tìm kiếm đoạn chat..." />
        </div>
      </div>
      <div className="max-h-screen overflow-y-auto px-0 sm:px-3">
        <p className="px-1 py-[10px] text-lg font-medium text-[#246AA3] sm:px-4">Trò chuyện</p>
        <ul className="flex flex-col gap-1">
          <li className="cursor-pointer rounded-lg bg-chat-item">
            <div className="flex gap-3 px-2 py-1 sm:px-3 sm:py-2">
              <ImageComponent
                src="https://s3-alpha-sig.figma.com/img/f906/8bf5/df0e160d30bdbf8e0706c92ebf148036?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Svapkp61guL00Yw2zZb7Nt5lCdu3OP5OYV32VdUSjY0M-4L1nCSVBoLmgGW1~LkiRIPMz5Yiql6HiD4a9b6tJivkLRWsW09L0NSJ5xrvvqzaGXk4BMNd5mO3ydkIotVEROXgdNsU10kZXLKiJl9pbmi6OhuOi9nPSKRJPHaJF4xNy58b6DKayFcM95Tt1Kuym8HJhpE7-r4GGJbMyKcURy49d27bN-B1-DjARNj1XcDlBHIBk-3ZWXbgYL0TbPszYoNUy8N7t03ta1pQDyjGuljqtpQXfjS1D~kMUQYRl5mm19zq8cvz9SnMOE8rWNox5E22XUvf7sU8dCSSVOb9HQ__"
                alt="Avatar"
                width={40}
                height={40}
                className="flex-shrink-0 rounded-full border-2 object-cover"
              />
              <div className="flex flex-col text-[13px] font-medium text-primary-white lg:text-[15px]">
                <span>Waldemar Mannering</span>
                <span>Refer friends. Get rewards.</span>
              </div>
              <div className="ml-auto text-[13px] font-medium text-primary-white">1 phút</div>
            </div>
          </li>
          <li className="cursor-pointer rounded-lg">
            <div className="flex gap-3 px-2 py-1 sm:px-3 sm:py-2">
              <ImageComponent
                src="https://s3-alpha-sig.figma.com/img/0d8b/ef28/97ae4d7cc461333f18ac5f080892a455?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jViu4Jv7yHP5rkvyyoiPECtcYM4gPPr6qTuwYsgaClPyy5kq6ensPExcoflb0bCoxlFUVrUtgx9xcGG2nkv5uSUm05TM~MPYdzVRMV8xu~uqTSrz3vvWFWt3hzmyukaBx1GnnlPh5I8j8y-hZP-mcdUHgzPkLp-vBQ3R~T8Tnoc4KwSwcwACpdQ7Rfyf58AaDCiPYIyFraZJntZEAFS-sDTSaPnnhlR85sJOx3SQRkkjFl8A7-VLCOdJOz58f9ZcJIi3tPYaP6i0RefAPy2fSRcucmZy9qMB-mrT2vf5HyyTLtd4z2DwYrBxR942BtHtU1xyoY5LoALbGzjR8wOK2A__"
                alt="Avatar"
                width={40}
                height={40}
                className="flex-shrink-0 rounded-full border-2 object-cover"
              />
              <div className="flex flex-col text-[13px] font-medium lg:text-[15px]">
                <span className="text-[#4B465C]">Natalie Maxwell</span>
                <span className="text-[#5d586cd4]">Send a photo</span>
              </div>
              <div className="ml-auto text-[13px] font-medium text-[#5d586cd4]">8 giờ</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const ChatLeft = () => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isShowSidebar = useSelector((store: any) => store.global.showSidebar);
  const dispatch = useDispatch();
  return isMobileAndTablet ? (
    <Drawer open={isShowSidebar} onClose={() => dispatch(showSidebar())} classes={{ paper: 'w-3/4 max-w-[400px] p-4 flex flex-col gap-6' }}>
      <SidebarChat />
    </Drawer>
  ) : (
    <SidebarChat />
  );
};
export default ChatLeft;
