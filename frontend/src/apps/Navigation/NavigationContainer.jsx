import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UnorderedListOutlined,
  ContainerOutlined,
  SettingOutlined,
  ReconciliationOutlined,
  LayoutFilled,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import './NavigationContainer.css';
import jestyLogo from '@/style/images/logo.png';

const { Sider } = Layout;

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const translate = useLanguage();

  const items = [
    {
      key: 'dashboard',
      icon: <LayoutFilled />,
      label: translate('dashboard'),
      path: '/',
    },
    {
      key: 'leads',
      icon: <UnorderedListOutlined />,
      label: translate('leads'),
      path: '/customer',
    },
    {
      key: 'integrations',
      icon: <ContainerOutlined />,
      label: translate('integrations'),
      path: '/integrations',
    },
    {
      key: 'generalSettings',
      icon: <SettingOutlined />,
      label: translate('settings'),
      path: '/settings',
    },
    {
      key: 'about',
      icon: <ReconciliationOutlined />,
      label: translate('about'),
      path: '/about',
    },
  ];

  const pathKeyMap = {
  '/': 'dashboard',
  '/customer': 'leads',
  '/integrations': 'integrations',
  '/settings': 'generalSettings',
  '/about': 'about',
};

const selectedKey = pathKeyMap[location.pathname] || '';

  return (
    <Sider
      width={200}
      theme="dark"
      className="custom-sidebar"
      style={{ position: 'sticky', left: 0, top: 0, bottom: 0, zIndex: 1000, overflowY: 'hidden'}}
    >
      <div className="sidebar-logo">
        <img src={jestyLogo} alt="Logo" className="logo-image" />
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]}
        className="custom-menu"
        items={items.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => navigate(item.path),
          className: 'custom-menu-item',
        }))}
      />
      <div className="help-support-card" style={{padding: '10px', background: '#fff', borderRadius: '10px', margin: '5px'}}>
        <div style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '12px'}}>Help and Support</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer'}} onClick={() => {}}>
            <span role="img" aria-label="video">🎥</span> Video Tutorials
          </button>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer'}} onClick={() => {}}>
            <span role="img" aria-label="docs">📄</span> Help Documents
          </button>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer'}} onClick={() => {}}>
            <span role="img" aria-label="faq">❓</span> FAQs
          </button>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer'}} onClick={() => {}}>
            <span role="img" aria-label="guide">📘</span> Business Guides
          </button>
        </div>
      </div>
    </Sider>
  );
}
