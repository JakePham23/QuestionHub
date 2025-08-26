"use client";

import React from "react";
import { Modal, Form, Button, Input, Typography, notification } from "antd";
import { AxiosError } from "axios";
import {
  validatePassword,
  validateEmail,
  validateUsername,
} from "../../utils/validate";
import authService from "@/services/auth.service";

type SignupModalProps = {
  open: boolean;
  onCancel: () => void;
  onSignupSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

const SignupModal: React.FC<SignupModalProps> = ({
  open,
  onCancel,
  onSignupSuccess,
  onSwitchToLogin,
}) => {
  const onFinish = async (values: SignupFormValues) => {
    try {
      await authService.signup({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      notification.success({
        message: "Tạo tài khoản thành công!",
        description: "Bây giờ bạn có thể đăng nhập với tài khoản mới.",
      });

      onSignupSuccess?.();
      onCancel();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      notification.error({
        message: "Đăng ký thất bại",
        description:
          err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
      });
    }
  };

  return (
    <Modal
      title={
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          Tạo Tài Khoản
        </Typography.Title>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form<SignupFormValues>
        name="signup_modal_form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        style={{ paddingTop: "20px" }}
      >
        {/* giữ nguyên form bạn viết */}
      </Form>
    </Modal>
  );
};

export default SignupModal;
