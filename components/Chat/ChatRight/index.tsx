import React from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import ImageComponent from '@/components/Common/Image';
import { showSidebar } from '@/store/slices/global';
const { TextArea } = Input;

const ChatRight = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-solid bg-white py-5">
        <div className="flex h-[41.5px] items-center gap-3 px-[20px]">
          {isMobileAndTablet && (
            <IconButton onClick={() => dispatch(showSidebar())}>
              <MenuIcon />
            </IconButton>
          )}
          <ImageComponent
            src="https://s3-alpha-sig.figma.com/img/f906/8bf5/df0e160d30bdbf8e0706c92ebf148036?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Svapkp61guL00Yw2zZb7Nt5lCdu3OP5OYV32VdUSjY0M-4L1nCSVBoLmgGW1~LkiRIPMz5Yiql6HiD4a9b6tJivkLRWsW09L0NSJ5xrvvqzaGXk4BMNd5mO3ydkIotVEROXgdNsU10kZXLKiJl9pbmi6OhuOi9nPSKRJPHaJF4xNy58b6DKayFcM95Tt1Kuym8HJhpE7-r4GGJbMyKcURy49d27bN-B1-DjARNj1XcDlBHIBk-3ZWXbgYL0TbPszYoNUy8N7t03ta1pQDyjGuljqtpQXfjS1D~kMUQYRl5mm19zq8cvz9SnMOE8rWNox5E22XUvf7sU8dCSSVOb9HQ__"
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full border-2 object-cover"
          />
          <p className=" text-[15px] font-medium text-[#4B465C]">Waldemar Mannering</p>
        </div>
      </div>
      <div className="relative h-full bg-[#F8F7FA]">
        <div className="absolute bottom-5 left-1/2 flex w-[96%] -translate-x-1/2 transform items-center rounded-lg bg-primary-white shadow-md">
          {/* <input type="text" placeholder="Type your message here…" className="w-full border-none" /> */}
          <TextArea rows={1} placeholder="Nhập tin nhắn..." className="no-focus border-none focus:border-none" />
          <IconButton className="!p-2">
            <SendIcon className="text-primary-main" fontSize="medium" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
export default ChatRight;
