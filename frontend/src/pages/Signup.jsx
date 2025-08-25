import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';
import { Form, Button } from 'antd';

import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import SignupForm from '@/forms/SignupForm'; // <-- Use this instead of LoginForm
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const SignupPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(register({ registerData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer = () => (
    <Loading isLoading={isLoading}>
      <Form layout="vertical" onFinish={onFinish}>
        <SignupForm /> {/* <-- Use SignupForm here */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} size="large">
            {translate('Sign up')}
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign up" isForRegister />;
};

export default SignupPage;
