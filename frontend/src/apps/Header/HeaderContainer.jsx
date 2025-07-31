import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, Avatar, Dropdown, Input, Tooltip } from 'antd';
import {
  BellOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  SearchOutlined,
  LogoutOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { FILE_BASE_URL } from '@/config/serverApiConfig';
import useLanguage from '@/locale/useLanguage';

const { Header } = Layout;

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const translate = useLanguage();
  const navigate = useNavigate();

  const notificationMenu = {
    items: [
      {
        key: '1',
        label: (
          <div
            style={{
              width: '200px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
            }}
          >
            No notifications right now
          </div>
        ),
      },
    ],
  };

  const reminderMenu = {
    items: [
      {
        key: '1',
        label: (
          <div
            style={{
              width: '200px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
            }}
          >
            No reminders right now
          </div>
        ),
      },
    ],
  };

  const avatarMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to="/profile">{translate('profile_settings')}</Link>,
      },
      {
        key: 'appSettings',
        icon: <ToolOutlined />,
        label: <Link to="/settings">{translate('app_settings')}</Link>,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: <Link to="/logout">{translate('logout')}</Link>,
      },
    ],
  };

  return (
    <Header
      style={{
        background: '#eceef3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '20px',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '64px',
        borderBottom: '1px solid #d9d9d9',
      }}
    >
      {/* Settings Icon (link to /settings) */}
        <Link to="/settings" style={{ paddingTop: '7px' }}>
              <Tooltip title="Settings">
          <SettingOutlined style={{ fontSize: '25px', color: '#555', cursor: 'pointer' }} />
                </Tooltip>
        </Link>

      {/* Notification Icon */}
      <Dropdown menu={notificationMenu} trigger={['click']} placement="bottomRight">
        <Tooltip title="Notifications">
          <BellOutlined style={{ fontSize: '25px', color: '#555', cursor: 'pointer' }} />
        </Tooltip>
      </Dropdown>

      {/* Reminder Icon */}
      <Dropdown menu={reminderMenu} trigger={['click']} placement="bottomRight">
        <Tooltip title="Reminders">
          <ClockCircleOutlined style={{ fontSize: '25px', color: '#555', cursor: 'pointer' }} />
        </Tooltip>
      </Dropdown>

      {/* Search Input */}
      <Input
        placeholder="Search..."
        suffix={<SearchOutlined />}
        style={{
          width: 200,
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Avatar Dropdown */}
      <Dropdown menu={avatarMenu} trigger={['click']} placement="bottomRight">
        <Avatar
          size="large"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: '#f56a00',
            backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
            boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 6px 1px',
            cursor: 'pointer',
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Dropdown>
    </Header>
  );
}
