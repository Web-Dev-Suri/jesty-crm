import { ErpContextProvider } from '@/context/erp';

import { Layout } from 'antd';
import { useSelector } from 'react-redux';

const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        className="whiteBox layoutPadding"
        style={{
          width: '100%',
          maxWidth: '1100px',
          minHeight: '600px',
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
