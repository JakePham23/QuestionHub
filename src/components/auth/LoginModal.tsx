'use client'
import React from 'react';
import { Modal, Form, Button, Input, Typography, notification, message } from 'antd';
// import authService from '../../services/auth.service.js';

// Định nghĩa kiểu props cho component
interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoginSuccess?: (user: any) => void; // có thể tạo interface User riêng nếu có API model
  onSwitchToSignup?: () => void;
}

// data type form
interface LoginFormValues {
  username: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onCancel,
  onLoginSuccess,
  onSwitchToSignup
}) => {
  // Hàm xử lý khi submit form thành công
  const onFinish = async (values: LoginFormValues) => {
    try {
      // TODO: gọi API thật
      // const response = await authService.login(values.username, values.password);
      const response = {
        data: {
          status: 'OK',
          metadata: {
            accessToken: 'fakeAccessToken',
            refreshToken: 'fakeRefreshToken',
            user: { id: 1, name: values.username }
          },
          message: 'Đăng nhập thành công'
        }
      };

      if (response.data.status === 'OK') {
        const { accessToken, refreshToken, user } = response.data.metadata;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        message.success('Đăng nhập thành công!');

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        message.error(response.data.message || 'Đăng nhập thất bại!');
      }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notification.error({
        message: 'Đăng nhập thất bại',
        description: error.response?.data?.message || 'Đã có lỗi xảy ra.'
      });
    }
  };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title={
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
          Đăng Nhập
        </Typography.Title>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form<LoginFormValues>
        name="login_modal_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        style={{ paddingTop: '20px' }}
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Đăng nhập
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Typography.Text>
            Chưa có tài khoản?{' '}
            <Button type="link" onClick={onSwitchToSignup}>
              Đăng ký ngay
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
