import { Form, Input } from 'antd';
import useLanguage from '@/locale/useLanguage';

export default function SignupForm() {
  const translate = useLanguage();

  return (
    <>
      <Form.Item
        label={translate('Full Name')}
        name="fullName"
        rules={[{ required: true, message: translate('Please enter your full name!') }]}
      >
        <Input placeholder={translate('Full Name')} size="large" />
      </Form.Item>
      <Form.Item
        label={translate('Organization Name')}
        name="organizationName"
        rules={[{ required: true, message: translate('Please enter your organization name!') }]}
      >
        <Input placeholder={translate('Organization Name')} size="large" />
      </Form.Item>
      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          { required: true, message: translate('Please enter your email!') },
          { type: 'email', message: translate('Please enter a valid email!') },
        ]}
      >
        <Input placeholder={translate('Email')} size="large" />
      </Form.Item>
      <Form.Item
        label={translate('Password')}
        name="password"
        rules={[{ required: true, message: translate('Please enter your password!') }]}
      >
        <Input.Password placeholder={translate('Password')} size="large" />
      </Form.Item>
      <Form.Item
        label={translate('Confirm Password')}
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: translate('Please confirm your password!') },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(translate('Passwords do not match!')));
            },
          }),
        ]}
      >
        <Input.Password placeholder={translate('Confirm Password')} size="large" />
      </Form.Item>
    </>
  );
}