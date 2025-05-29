import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'Maximizze'}
      subTitle={translate('Do you need help on customization of this app?')}
      extra={
        <>
          <p>
            Website : <a href="https://maximisemedia.in/">www.maximisemedia.in/</a>{' '}
          </p>
          {/* <p>
            GitHub :{' '}
            <a href="https://github.com/idurar/idurar-erp-crm">
              https://github.com/idurar/idurar-erp-crm
            </a>
          </p> */}
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://maximisemedia.in/contact-us.php`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
