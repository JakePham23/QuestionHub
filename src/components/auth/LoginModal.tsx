"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Input,
  Typography,
  notification,
  message,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { AxiosError } from "axios";
import authService from "@/services/auth.service";
import { validatePassword } from "../../utils/validate";
import useGoogleAuth from "@/components/hook/GoogleSignIn";

interface User {
  id: number;
  name: string;
}

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onLoginSuccess?: (user: User) => void;
  onSwitchToSignup?: () => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}
interface ForgotEmailFormValues {
  email: string;
}
interface ForgotOtpFormValues {
  otp: string;
}
interface ResetPasswordFormValues {
  password: string;
  confirm_password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onCancel,
  onLoginSuccess,
  onSwitchToSignup,
}) => {
  const {
    signInWithGoogle,
    loading: googleLoading,
    isAuthenticated,
    user: googleUser,
    error: googleError,
  } = useGoogleAuth();

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");

  const onFinish = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);

      const response = {
        data: {
          status: "OK",
          metadata: {
            accessToken: "fakeAccessToken",
            refreshToken: "fakeRefreshToken",
            user: { id: 1, name: values.username },
          },
          message: "Đăng nhập thành công",
        },
      };

      if (response.data.status === "OK") {
        const { accessToken, refreshToken, user } = response.data.metadata;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        message.success("Đăng nhập thành công!");
        onLoginSuccess?.(user);
        onCancel();
      } else {
        message.error(response.data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      notification.error({
        message: "Đăng nhập thất bại",
        description: err.response?.data?.message || "Đã có lỗi xảy ra.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsForgotPassword(false);
    setForgotStep(1);
    onCancel();
  };

  useEffect(() => {
    if (isAuthenticated && googleUser) {
      onLoginSuccess?.(googleUser as unknown as User);
      onCancel();
    }
  }, [isAuthenticated, googleUser, onLoginSuccess, onCancel]);

  // Forgot password handlers giữ nguyên ...

  return (
    <Modal
      title="Đăng nhập"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      {/* giữ nguyên toàn bộ JSX form login + forgot password như bạn viết */}
    </Modal>
  );
};

export default LoginModal;
