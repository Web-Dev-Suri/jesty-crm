import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UnorderedListOutlined,
  ContainerOutlined,
  SettingOutlined,
  ReconciliationOutlined,
  LayoutFilled,
  RobotFilled
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
      key: 'aiAgentDemo',
      icon: <RobotFilled />,
      label: translate('AI Agent'),
      path: '/aiagent',
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
    '/aiagent': 'aiAgentDemo',
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
      <div className="help-support-card" style={{padding: '10px 0', borderRadius: '10px', margin: '5px 0', position: 'absolute', bottom: '0%', width: '100%'}}>
        <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', color: '#fff', paddingLeft: 10}}>Guides and Help</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: 'none', fontSize: 12, cursor: 'pointer', color: '#fff', width: '90%', borderBottom: '1px solid #fff'}} onClick={() => {}}>
            <span role="img" aria-label="video">🎥</span> Video Tutorials
          </button>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: 'none', fontSize: 12, cursor: 'pointer', color: '#fff', width: '90%', borderBottom: '1px solid #fff'}} onClick={() => {}}>
            <span role="img" aria-label="docs">📄</span> Help Documents
          </button>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: 'none', fontSize: 12, cursor: 'pointer', color: '#fff', width: '90%', borderBottom: '1px solid #fff'}} onClick={() => {}}>
            <span role="img" aria-label="faq">❓</span> FAQs
          </button>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: 'none', fontSize: 12, cursor: 'pointer', color: '#fff', width: '90%', borderBottom: '1px solid #fff'}} onClick={() => {}}>
            <span role="img" aria-label="guide">📘</span> Business Guides
          </button>
        </div>
      </div>
    </Sider>
  );
}
