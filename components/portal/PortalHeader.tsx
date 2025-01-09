import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  EditOutlined,
  ExportOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Drawer, Dropdown, Menu, Space } from 'antd';
import Link from 'next/link';
import ChatIcon from '@mui/icons-material/Chat';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageComponent from '../Common/Image';
import Notification from '../Common/Notification';
import { getUserState, logOut, MenuItem } from '@/store/slices/user';
import { useAppSelector } from '@/store/hooks';
import { formatRoleAccount } from '@/utils/app/format';

type ItemType =
  | { label: React.ReactNode; key: string } // Mục có label và key
  | { type: 'divider'; key: string }; // Mục là divider với key

const PortalHeader: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const role = useAppSelector(state => state.user.roleAccount);

  const url = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '/admin/system/dashboard';
      case 'UNIVERSITY':
        return '/admin/school/dashboard';
      case 'COMPANY':
        return '/admin/company/dashboard';
      default:
        return '';
    }
  };

  const { token, roleAccount } = useSelector(getUserState);
  const user = useAppSelector(state => state.user);
  const router = useRouter(); // Hook lấy thông tin đường dẫn
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    router.push('/');
  };

  const items: ItemType[] = [
    {
      label: (
        <a className="flex items-center justify-between">
          <span className="min-w-[150px]">Tài khoản</span>
          <ExportOutlined />
        </a>
      ),
      key: '0',
    },
    {
      label: <Link href={'#!'}>Thông báo</Link>,
      key: '1',
    },
    {
      label: <Link href={'#!'}>Cài đặt chung</Link>,
      key: '2',
    },
    {
      label: <Link href={'#!'}>Cài đặt bảo mật</Link>,
      key: '3',
    },
    {
      label: <Link href={'/auth/forgot-password/send-email'}>Quên mật khẩu</Link>,
      key: '4',
    },
    {
      label: <Link href={url(role)}>Vào trang quản trị</Link>,
      key: '5',
    },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      label: (
        <a onClick={handleLogout} className="flex items-center justify-between">
          <span>Đăng xuất</span>
          <LogoutOutlined />
        </a>
      ),
      key: 'logout',
    },
  ];

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const getMenuItems = (roleAccount: string, token: string, handleLogout: () => void) => {
    const baseItems = [
      {
        key: '1',
        icon: <AppstoreOutlined />,
        label: (
          <Link href="/" className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Trang chủ</span>
          </Link>
        ),
      },
    ];

    const universityItems = [
      {
        key: '2',
        icon: <DesktopOutlined />,
        label: (
          <Link href="/portal/jobs" className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Việc làm</span>
          </Link>
        ),
      },
      {
        key: '3',
        icon: <ContainerOutlined />,
        label: (
          <Link href="/portal/companies" className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Công ty</span>
          </Link>
        ),
      },
    ];

    const companyItems = [
      {
        key: '2',
        icon: <DesktopOutlined />,
        label: (
          <Link href="/portal/workshops" className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Workshop</span>
          </Link>
        ),
      },
      {
        key: '3',
        icon: <ContainerOutlined />,
        label: (
          <Link href="/portal/schools" className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Trường học</span>
          </Link>
        ),
      },
    ];

    const sharedItems = [
      {
        key: 'sub1',
        label: (
          <a className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Cài đặt</span>
          </a>
        ),
        icon: <SettingOutlined />,
        children: [
          { key: '5', label: 'Option 5' },
          { key: '6', label: 'Option 6' },
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
      {
        key: '4',
        label: (
          <a onClick={handleLogout} className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Đăng xuất</span>
          </a>
        ),
        icon: <LogoutOutlined />,
      },
    ];

    const guestItems = [
      {
        key: '1',
        icon: <LoginOutlined />,
        label: (
          <Link href="/auth/login" className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Đăng nhập</span>
          </Link>
        ),
      },
      {
        key: '2',
        icon: <EditOutlined />,
        label: (
          <Link href="/auth/Register" className="py-[10px] text-lg text-primary-black hover:text-primary-main">
            <span>Đăng ký</span>
          </Link>
        ),
      },
    ];

    if (!token) {
      return guestItems;
    }

    if (roleAccount === 'UNIVERSITY') {
      return [...baseItems, ...universityItems, ...sharedItems];
    }

    if (roleAccount === 'COMPANY') {
      return [...baseItems, ...companyItems, ...sharedItems];
    }

    return [];
  };

  const menuItems: MenuItem[] = getMenuItems(roleAccount, token, handleLogout);

  useEffect(() => {
    const header = document.getElementsByTagName('header')[0];

    const handleScroll = () => {
      if (window.scrollY > 0) {
        // Transition from fixed to sticky
        header.classList.add('-translate-y-full');
        setTimeout(() => {
          setIsSticky(true);
          header.classList.remove('-translate-y-full');
        }, 300); // Smooth transition time
      } else {
        // Transition from sticky to fixed
        header.classList.add('-translate-y-full');
        setTimeout(() => {
          setIsSticky(false);
          header.classList.remove('-translate-y-full');
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActiveLink = (path: string) => {
    return router.pathname === path ? 'text-primary-main after:w-full' : ''; // Nếu đường dẫn hiện tại trùng với path, thì đánh dấu là active
  };

  const isLoggedIn = !!token;
  return (
    <header
      className={`
    ${isSticky ? 'mp_header_sticky translate-y-0' : 'mp_header_fixed'} 
    transition-transform duration-500 ease-in-out
  `}>
      <div className="container-none">
        <div
          className={`rounded-b-0 mx-auto bg-primary-white px-[15px] xl:container lg:px-[20px] lg:py-0 xl:rounded-b-[30px] xl:px-[45px] ${
            isSticky ? '' : `mp_box_shadow`
          }`}>
          <div className="">
            <div className="flex h-full items-center justify-between">
              <Link href="/images/logogif.gif" className="rts__logo flex items-center">
                <ImageComponent src="/images/logogif.gif" alt="logo" width={60} height={60} className=" pointer-events-none h-auto object-cover" />
                <h2 className="ml-2 font-logo text-3xl font-bold">
                  <span className="text-primary-main">Job</span>Link
                </h2>
              </Link>
              <div className="rts__menu flex h-[80px] items-center gap-[3rem] lg:h-[98px] lg:gap-[1.5rem] xl:gap-[3rem]">
                {/* Hiển thị navigation nếu đã đăng nhập */}
                {isLoggedIn && roleAccount === 'UNIVERSITY' && (
                  <div className="navigation hidden lg:block">
                    <nav className="navigation__menu" id="offcanvas__menu">
                      <ul className="relative flex w-max items-center gap-[25px]">
                        <li className="navigation__menu--item relative">
                          <Link href="/" className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item active: relative py-[39px] ${isActiveLink('/')}`}>
                            Trang chủ
                          </Link>
                        </li>
                        <li className="navigation__menu--item relative">
                          <Link
                            href="/portal/jobs"
                            className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item relative py-[39px] ${isActiveLink('/portal/jobs')}`}>
                            Việc làm
                          </Link>
                        </li>
                        <li className="navigation__menu--item relative">
                          <Link
                            href="/portal/companies"
                            className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item relative py-[39px] ${isActiveLink('/portal/companies')}`}>
                            Công ty
                          </Link>
                        </li>
                        <li className="navigation__menu--item relative">
                          <Link
                            href="/portal/about-us"
                            className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item relative py-[39px] ${isActiveLink('/portal/companies')}`}>
                            Về chúng tôi
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
                {isLoggedIn && roleAccount === 'COMPANY' && (
                  <div className="navigation hidden lg:block">
                    <nav className="navigation__menu" id="offcanvas__menu">
                      <ul className="relative flex w-max items-center gap-[25px]">
                        <li className="navigation__menu--item relative">
                          <Link href="/" className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item relative py-[39px] ${isActiveLink('/')}`}>
                            Trang chủ
                          </Link>
                        </li>
                        <li className="navigation__menu--item relative">
                          <Link
                            href="/portal/workshops"
                            className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item relative py-[39px] ${isActiveLink('/portal/workshops')}`}>
                            Workshop
                          </Link>
                        </li>
                        <li className="navigation__menu--item relative">
                          <Link
                            href="/portal/schools"
                            className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item relative py-[39px] ${isActiveLink('/portal/schools')}`}>
                            Trường học
                          </Link>
                        </li>
                        <li className="navigation__menu--item relative">
                          <Link
                            href="/portal/about-us"
                            className={`mp_transition_4 after:mp_transition_4 mp_nav_menu_item relative py-[39px] ${isActiveLink('/portal/companies')}`}>
                            Về chúng tôi
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>

              <div className="header__right__btn flex items-center justify-between gap-4">
                {/* Ẩn các thẻ Link đăng nhập và đăng ký nếu đã đăng nhập */}
                {!isLoggedIn ? (
                  <div className="hidden items-center gap-4 lg:flex">
                    <Link
                      href="/auth/login"
                      className="mp_button_small mp_transition_4 mp_no_fill_button hidden items-center justify-center gap-2 rounded-md text-sm sm:flex"
                      aria-label="Login Button"
                      data-bs-toggle="modal"
                      data-bs-target="#loginModal">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      <span>Đăng nhập</span>
                    </Link>
                    <Link
                      href="/auth/Register"
                      className="mp_button_small mp_transition_4 mp_fill_button hidden rounded-md text-sm sm:flex"
                      aria-label="Job Posting Button">
                      <span>Đăng ký</span>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="user__menu hidden lg:block">
                      <div className="user_wrapper flex items-center justify-between gap-4">
                        <div className="user-avatar flex h-[55px] w-[55px] items-center justify-center rounded-full bg-primary-light">
                          <ImageComponent
                            src={user?.logoUrl || `/images/user-default.png`}
                            alt=""
                            width={45}
                            height={45}
                            className="h-[45px] w-[45px] rounded-full  object-contain"
                          />
                        </div>
                        <div className="user-info flex flex-col">
                          <span className="user-name text-primary-black">{user?.name}</span>
                          <span className="user-role text-primary-gray">{roleAccount}</span>
                        </div>
                        <Dropdown
                          placement="bottomRight"
                          menu={{
                            items,
                          }}>
                          <a onClick={e => e.preventDefault()}>
                            <Space className="cursor-pointer">
                              <i className="fa-solid fa-chevron-down"></i>
                            </Space>
                          </a>
                        </Dropdown>
                      </div>
                    </div>
                    <Link href={'/portal/chat'}>
                      <ChatIcon />
                    </Link>
                    <Notification />
                  </>
                )}
                <div>
                  {/* Nút mở menu */}
                  <MenuOutlined onClick={showDrawer} className="block cursor-pointer text-xl lg:hidden" />

                  {/* Drawer chứa menu */}
                  <Drawer
                    placement="right"
                    onClose={onClose}
                    visible={visible}
                    bodyStyle={{ padding: 0 }}
                    closeIcon={null} // Hiển thị nút tắt
                    title={
                      <div className="flex items-center gap-4">
                        <div className="user-avatar flex h-[55px] w-[55px] items-center justify-center rounded-full bg-primary-light">
                          <ImageComponent
                            src={user?.logoUrl || '/images/user-default.png'}
                            alt="User Avatar"
                            width={45}
                            height={45}
                            className="h-[45px] w-[45px] rounded-full object-contain"
                          />
                        </div>
                        <div className="user-info flex flex-col">
                          <span className="user-name text-primary-black">{user?.name || user?.name}</span>
                          <span className="user-role text-primary-gray">{formatRoleAccount(role)}</span>
                        </div>
                      </div>
                    }>
                    <Menu
                      mode="inline"
                      items={menuItems}
                      onClick={onClose} // Đóng Drawer khi chọn menu
                    />
                  </Drawer>

                  {/* Menu dạng sidebar cho màn hình lớn */}
                  <div style={{ width: 256, display: 'none' }} className="hidden lg:block">
                    <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline" items={menuItems} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
