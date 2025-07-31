import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function LoginForm({mode = 'login'}) {
  const translate = useLanguage();
  const isSignup = mode === 'signup';
    return (
    <>
      {isSignup && (
        <Form.Item
          label={translate('Full Name')}
          name="fullName"
          rules={[{ required: true }]}
        >
          <Input placeholder="John Doe" size="large" />
        </Form.Item>
      )}

      {isSignup && (
        <Form.Item
          label={translate('Organization Name')}
          name="organizationName"
          rules={[{ required: true, message: translate('Please enter your organization name!') }]}
        >
          <Input placeholder="Your Agency/Organization" size="large" />
        </Form.Item>
      )}

      <Form.Item
        label={translate('email')}
        name="email"
        rules={[{ required: true }, { type: 'email' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Enter Your Email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={translate('password')}
        name="password"
        rules={[{ required: true }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Enter Password"
          size="large"
        />
      </Form.Item>

      {isSignup && (
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
          <Input.Password placeholder="Repeat your password" size="large" />
        </Form.Item>
      )}

      {mode === 'login' && (
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>{translate('Remember me')}</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="/forgetpassword">
            {translate('Forgot password')}
          </a>
        </Form.Item>
      )}
    </>
  );
}
