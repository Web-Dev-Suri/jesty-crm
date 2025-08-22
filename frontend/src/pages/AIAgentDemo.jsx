import { Result, Button } from 'antd';
import { RobotFilled } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const AIAgentDemo = () => {
  const translate = useLanguage();
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    //   background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      borderRadius: 16,
    //   boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
      margin: 32,
    }}>
      <Result
        icon={<RobotFilled style={{ fontSize: 64, color: '#1475d0ff' }} />}
        title={<span style={{ fontWeight: 700, fontSize: 32, color: '#fff' }}>AI Agent Window</span>}
        subTitle={
          <span style={{ color: '#d6e4ff', fontSize: 18 }}>
            {translate('Exciting AI features are on the way!')}
            <br />
            {translate('Stay tuned for our upcoming AI Agent demo experience.')}
          </span>
        }
        extra={
          <Button
            type="primary"
            size="large"
            style={{ borderRadius: 8, marginTop: 16 }}
            onClick={() => window.open('https://maximisemedia.in/contact-us.php')}
          >
            {translate('Contact us')}
          </Button>
        }
        style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 16, padding: 32 }}
      />
    </div>
  );
};

export default AIAgentDemo;