import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Input } from 'antd';
import { GoogleOutlined, CheckCircleTwoTone, ArrowLeftOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';

import useLanguage from '@/locale/useLanguage';
import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import Loading from '@/components/Loading';
import logo from '@/style/images/jesty-crm-logo-black.png';

const features = [
  'Get started in 30 seconds',
  'Free forever for core features',
];

const SignupPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const [form] = Form.useForm();

  const handleGoogleSuccess = async (credentialResponse) => {
    dispatch(register({ registerData: { googleToken: credentialResponse.credential } }));
  };

  // Step 1: Email or Google
  const Step1 = () => (
    <>
      <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 32 }}>{translate('Create An Account')}</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
        }}
        width="100%"
        useOneTap
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '24px 0'
      }}>
        <div style={{
          flex: 1,
          height: 1,
          background: '#eceef3'
        }} />
        <span style={{
          margin: '0 16px',
          color: '#888',
          fontWeight: 500
        }}>OR</span>
        <div style={{
          flex: 1,
          height: 1,
          background: '#eceef3'
        }} />
      </div>
      <Form.Item
        name="email"
        label={translate('Email')}
        rules={[
          { required: true, message: translate('Please enter your email!') },
          { type: 'email', message: translate('Please enter a valid email!') },
        ]}
      >
        <Input placeholder="e.g. email@example.com" size="large" />
      </Form.Item>
      {/* TODO: Add Google reCAPTCHA here */}
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
          Get Started
        </Button>
      </Form.Item>
      <p style={{ textAlign: 'center' }}> Already have an account? <a href="/login">Log in</a></p>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#888' }}> By clicking sign up, you are agreeing to accept our <a href="https://jestycrm.com/terms-and-conditions">Terms of Service</a> and <a href="https://jestycrm.com/privacy-policy">Privacy Policy</a>.</p>
    </>
  );

  // Step 2: Name & Company
  const Step2 = () => (
    <>
      <Form.Item
        name="fullName"
        label={translate('Name')}
        rules={[{ required: true, message: translate('Please enter your name!') }]}
      >
        <Input placeholder="e.g. John Smith" size="large" />
      </Form.Item>
      <Form.Item
        name="organizationName"
        label={translate('Company Name')}
        rules={[{ required: true, message: translate('Please enter your company name!') }]}
      >
        <Input placeholder="e.g. ACME Corporation" size="large" />
      </Form.Item>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading}
          style={{ flex: 2 }}
        >
          Next
        </Button>
      </div>
    </>
  );

  // Step 3: Password
  const Step3 = () => (
    <>
      <Form.Item
        name="password"
        label={translate('Password')}
        rules={[{ required: true, message: translate('Please enter your password!') }]}
        hasFeedback
      >
        <Input.Password placeholder="Password" size="large" />
      </Form.Item>
      <Form.Item
        name="confirm"
        label={translate('Confirm Password')}
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
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading}
          style={{ flex: 2 }}
        >
          Sign Up
        </Button>
      </div>
    </>
  );

  const onFinish = (values) => {
    if (step === 1) {
      setFormData({ ...formData, ...values });
      setStep(2);
      form.resetFields(['fullName', 'organizationName', 'password', 'confirm']);
    } else if (step === 2) {
      setFormData({ ...formData, ...values });
      setStep(3);
      form.resetFields(['password', 'confirm']);
    } else if (step === 3) {
      const allData = { ...formData, ...values };
      dispatch(register({ registerData: allData }));
    }
  };

  // Reset on success
  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  return (
    <>
      <style>
        {`
          .signup-flex-container {
            display: flex;
            min-height: 100vh;
          }
          .signup-left, .signup-right {
            flex: 1;
            min-width: 0;
          }
          @media (max-width: 900px) {
            .signup-flex-container {
              flex-direction: column;
            }
            .signup-left {
              padding: 32px 16px 0 16px !important;
              min-height: 220px;
              align-items: center !important;
              text-align: center !important;
            }
            .signup-right {
              min-height: unset !important;
              padding: 32px 0 32px 0 !important;
              justify-content: center !important;
              padding: 0 !important;
            }
          }
        `}
      </style>
      <div className="signup-flex-container">
        {/* Left Side */}
        <div
          className="signup-left"
          style={{
            background: '#eceef3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 0px 48px 200px',
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            alt="Jesty CRM Logo Black"
            style={{ margin: '0 0 20px', display: 'block' }}
            width='300px'
            height='auto'
          />
          <h2
            style={{
              fontWeight: 700,
              fontSize: 28,
              marginBottom: 16,
            }}
          >
            World's 1st AI-Driven <br />
            Lead Management CRM
          </h2>
          <div
            style={{
              fontSize: 16,
              marginBottom: 32,
            }}
          >
            Automate first contact in under 10 seconds <br />
            and convert up to 52% of your leads into <br />
            meetings - without  expanding your sales team.
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: 16,
            }}
          >
            {features.map((f, i) => (
              <li
                key={i}
                style={{
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 8 }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
        {/* Right Side */}
        <div
          className="signup-right"
          style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            position: 'relative'
          }}
        >
          {/* Back button at top left */}
          {step > 1 && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => setStep(step - 1)}
              style={{
                position: 'absolute',
                top: 24,
                left: 24,
                color: '#888',
                fontWeight: 500,
                zIndex: 2,
              }}
            >
              Back
            </Button>
          )}
          <div style={{ width: 360, maxWidth: '90%' }}>
            <Loading isLoading={isLoading}>
              <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 />}
              </Form>
            </Loading>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
