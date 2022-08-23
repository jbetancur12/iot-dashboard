import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { sidebarNavigation, SidebarNavigationItem } from '../sidebarNavigation';
import { Menu } from 'antd';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const sidebarNavFlat = sidebarNavigation.reduce(
  (result: SidebarNavigationItem[], current) =>
    result.concat(current.children && current.children.length > 0 ? current.children : current),
  [],
);

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAppSelector((state) => state.user.user);

  const userRole = user ? user.role : 'USER_ROLE';

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = sidebarNavigation.find(({ children }) =>
    children?.some(({ url }) => url === location.pathname),
  );
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  const renderNavigation = (role: string) => {
    const navigationByRole =
      role && role === 'ADMIN_ROLE'
        ? sidebarNavigation.filter((item) => item.admin === true)
        : sidebarNavigation.filter((item) => item.admin !== true);

    return navigationByRole.map((nav) =>
      nav.children && nav.children.length > 0 ? (
        <Menu.SubMenu
          key={nav.key}
          title={t(nav.title)}
          icon={nav.icon}
          onTitleClick={() => setCollapsed(false)}
          popupClassName="d-none"
        >
          {nav.children.map((childNav) => (
            <Menu.Item key={childNav.key} title="">
              <Link to={childNav.url || ''}>{t(childNav.title)}</Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={nav.key} title="" icon={nav.icon}>
          <Link to={nav.url || ''}>{t(nav.title)}</Link>
        </Menu.Item>
      ),
    );
  };

  return (
    <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onClick={() => setCollapsed(true)}
    >
      {renderNavigation(userRole)}
    </S.Menu>
  );
};

export default SiderMenu;
