'use client';

import React from 'react';
import { Modal, Form, Button, Input, Typography, notification } from 'antd';
import { validatePassword, validateEmail, validateUsername } from '../../utils/validate'; 
// import authService from '../../services/auth.service';

type SignupModalProps = {
    open: boolean;
    onCancel: () => void;
    onSignupSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

interface SignupFormValues{
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ open, onCancel, onSignupSuccess, onSwitchToLogin }) => {
    
    const onFinish = async (values: SignupFormValues) => {
        try {
            // await authService.signup(values);

            notification.success({
                message: 'Tạo tài khoản thành công!',
                description: 'Bây giờ bạn có thể đăng nhập với tài khoản mới.',
            });

            if (onSignupSuccess) {
                onSignupSuccess();
            }
            
            onCancel(); // Đóng modal sau khi thành công

        } catch (error) {
            console.error("Signup failed", error);
            notification.error({
                message: 'Đăng ký thất bại',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                description: (error as any)?.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
            });
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Modal
            title={<Typography.Title level={3} style={{textAlign: 'center', marginBottom: 0}}>Tạo Tài Khoản</Typography.Title>}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={500}
        >
            <Form<SignupFormValues>
                name="signup_modal_form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                style={{ paddingTop: '20px' }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                        {
                            validator: (_, value) => {
                                const errorMessage = validateUsername(value);
                                return errorMessage ? Promise.reject(new Error(errorMessage)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input placeholder="Tên đăng nhập" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        {
                            validator: (_, value) => {
                                const errorMessage = validateEmail(value);
                                return errorMessage ? Promise.reject(new Error(errorMessage)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        {
                            validator: (_, value) => {
                                const errorMessage = validatePassword(value);
                                return errorMessage ? Promise.reject(new Error(errorMessage)) : Promise.resolve();
                            },
                        },
                    ]}
                    hasFeedback 
                >
                    <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Đăng Ký
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                    <Typography.Text>
                        Đã có tài khoản?{' '}
                        <Button type="link" onClick={onSwitchToLogin}>
                            Đăng nhập ngay
                        </Button>
                    </Typography.Text>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SignupModal;