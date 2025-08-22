import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from 'antd';

import Navigation from '@/apps/Navigation/NavigationContainer';
import HeaderContent from '@/apps/Header/HeaderContainer';
import AppRouter from '@/router/AppRouter';
import PageLoader from '@/components/PageLoader';
import useResponsive from '@/hooks/useResponsive';

import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

const { Sider, Content } = Layout;

export default function ErpCrmApp() {
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { isSuccess: settingIsloaded } = useSelector(selectSettings);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  if (!settingIsloaded) return <PageLoader />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navigation
        isMobile={isMobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Layout style={{ background: '#ffffff' }}>
        <HeaderContent
          onHamburgerClick={() => setSidebarOpen(true)}
          isMobile={isMobile}
        />
        <Content style={{ maxWidth: 1400, margin: 'auto', width: '100%', background: '#eceef3ff', padding: '20px' }}>
          <AppRouter />
        </Content>
      </Layout>
    </Layout>
  );
}
