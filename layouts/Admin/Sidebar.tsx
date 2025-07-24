/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { FC, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { useRouter } from 'next/router';
import { useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { showSidebar } from '@/store/slices/global';
import Logo from '@/components/Logo';

interface NavItem {
  id: number;
  icon?: JSX.Element;
  url: string;
  label: string;
  progress?: number;
  children?: NavItem[];
}

interface NavbarProps {
  props: NavItem[];
}

const SidebarItem: FC<{ item: NavItem; pathname: string; level?: number }> = ({ item, pathname, level = 0 }) => {
  const [open, setOpen] = useState<number | null>(null);
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + '/');
  const hasChildren = item.children && item.children.length > 0;
  const expanded = open === item.id || (hasChildren && item.children!.some(child => isActive(child.url)));

  return (
    <li>
      <div className="flex flex-col">
        <div
          className={`flex items-center gap-4 rounded-lg p-3 transition-all cursor-pointer ${
            isActive(item.url) ? 'bg-custom-gradient text-primary-black' : 'hover:bg-gradient-to-b hover:from-[#FEF2EB] hover:via-[#F1F1F1] hover:to-[#E4E0EA] text-gray-800'
          }`}
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={() => hasChildren ? setOpen(open === item.id ? null : item.id) : location.assign(item.url)}
        >
          {item.icon && <div className={`h-5 w-5 ${isActive(item.url) ? 'text-[#34A853]' : 'text-[#595959]'}`}>{item.icon}</div>}
          <span className="text-[17px] flex-1">{item.label}</span>
          {typeof item.progress === 'number' && (
            <div className="flex items-center w-28 ml-2">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 min-w-[2.5rem] text-right">{item.progress}%</span>
            </div>
          )}
          {hasChildren && (
            <span className="ml-2 text-gray-400">{expanded ? '▼' : '▶'}</span>
          )}
        </div>
        {hasChildren && expanded && (
          <ul className="ml-2 mt-2 space-y-2">
            {item.children!.map((child) => (
              <SidebarItem key={child.id} item={child} pathname={pathname} level={level + 1} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

const SidebarContent: FC<NavbarProps> = ({ props }) => {
  const router = useRouter();
  const { pathname } = router;
  return (
    <nav>
      <ul className="space-y-4">
        {props.map((item) => (
          <SidebarItem key={item.id} item={item} pathname={pathname} />
        ))}
      </ul>
    </nav>
  );
};

const Sidebar: FC<NavbarProps> = ({ props }) => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isShowSidebar = useSelector((store: any) => store.global.showSidebar);
  const dispatch = useDispatch();

  return isMobileAndTablet ? (
    <Drawer open={isShowSidebar} onClose={() => dispatch(showSidebar())} classes={{ paper: 'w-3/4 max-w-[400px] p-4 flex flex-col gap-6' }}>
      <div className="mt-5">
        <Logo />
      </div>
      <SidebarContent props={props} />
    </Drawer>
  ) : (
    <SidebarContent props={props} />
  );
};

export default Sidebar;
