"use client";
import React, { useState } from "react";
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
import authService from "@/services/auth.service";
import { validatePassword } from "../../utils/validate";
import useGoogleAuth from "@/components/hook/GoogleSignIn";

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoginSuccess?: (user: any) => void;
  onSwitchToSignup?: () => void;
}

// Data type for login form
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
    isPrompting,
  } = useGoogleAuth();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");

  // Handle successful login form submission
  const onFinish = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      // TODO: Replace with real API call
      // const response = await authService.login(values.username, values.password);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: error.response?.data?.message || "Đã có lỗi xảy ra.",
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

  const handleSwitchToForgotPassword = () => {
    setIsForgotPassword(true);
    setForgotStep(1);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

  // Close modal when Google auth succeeds
  React.useEffect(() => {
    if (isAuthenticated && googleUser) {
      onLoginSuccess?.(googleUser);
      onCancel();
    }
  }, [isAuthenticated, googleUser, onLoginSuccess, onCancel]);

  const onForgotEmailFinish = async (values: ForgotEmailFormValues) => {
    try {
      setIsForgotLoading(true);
      setForgotEmail(values.email);
      const result = await authService.requestPasswordReset(values.email);
      if (result.success) {
        message.success("Mã OTP đã được gửi đến email của bạn!");
        setForgotStep(2);
      } else {
        message.error(result.message || "Có lỗi xảy ra khi gửi OTP!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi OTP!");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const onForgotOtpFinish = async (values: ForgotOtpFormValues) => {
    try {
      setIsForgotLoading(true);
      setForgotOtp(values.otp);
      const result = await authService.verifyOTP(forgotEmail, values.otp);
      if (result.success) {
        message.success("Xác thực OTP thành công");
        setForgotStep(3);
      } else {
        message.error(result.message || "Có lỗi xảy ra khi gửi OTP!");
      }
    } catch (error) {
      message.error("Mã OTP không đúng!");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const onResetPasswordFinish = async (values: ResetPasswordFormValues) => {
    try {
      setIsForgotLoading(true);
      const result = await authService.resetPassword({
        email: forgotEmail,
        otp: forgotOtp,
        newPassword: values.password,
        confirmPassword: values.confirm_password,
      });
      if (result.success) {
        message.success("Đặt lại mật khẩu thành công!");
        setIsForgotPassword(false);
        setForgotStep(1);
      } else {
        message.error(result.message || "Có lỗi xảy ra khi đặt lại mật khẩu!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt lại mật khẩu!");
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              fontWeight: 600,
              background: "linear-gradient(135deg, #1890ff, #722ed1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isForgotPassword
              ? forgotStep === 1
                ? "Khôi Phục Mật Khẩu"
                : forgotStep === 2
                ? "Xác Thực OTP"
                : "Đặt Lại Mật Khẩu"
              : "Đăng Nhập"}
          </Typography.Title>
          <Typography.Text
            style={{ color: "#666", marginTop: "4px", fontSize: "14px" }}
          >
            {isForgotPassword
              ? forgotStep === 1
                ? "Nhập email để nhận mã OTP"
                : forgotStep === 2
                ? `Nhập mã OTP đã gửi tới email: ${forgotEmail}`
                : "Nhập mật khẩu mới cho tài khoản của bạn"
              : "Chào mừng bạn quay trở lại!"}
          </Typography.Text>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      styles={{
        header: {
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
        },
        body: {
          padding: "24px 32px 32px",
        },
      }}
    >
      {!isForgotPassword ? (
        // Login Form
        <Form<LoginFormValues>
          name="login_modal_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            label={<Typography.Text strong>Tên đăng nhập</Typography.Text>}
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input
              placeholder="Nhập tên đăng nhập của bạn"
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label={<Typography.Text strong>Mật khẩu</Typography.Text>}
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu của bạn"
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="link"
              onClick={handleSwitchToForgotPassword}
              style={{
                float: "right",
                padding: 0,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Quên mật khẩu?
            </Button>
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #1890ff, #722ed1)",
                border: "none",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
              }}
            >
              Đăng Nhập
            </Button>
          </Form.Item>

          <Divider style={{ margin: "12px 0" }}>
            <Typography.Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
              hoặc
            </Typography.Text>
          </Divider>

          <div id="google-signin-container">
            <Button
              icon={
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  style={{ width: 18, height: 18 }}
                />
              }
              onClick={signInWithGoogle}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 8,
              }}
            >
              Tiếp tục với Google
            </Button>
          </div>

          {googleError && (
            <Typography.Text style={{ color: "#ff4d4f" }}>
              {googleError}
            </Typography.Text>
          )}

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Typography.Text style={{ color: "#666", fontSize: "14px" }}>
              Chưa có tài khoản?{" "}
            </Typography.Text>
            <Button
              type="link"
              onClick={onSwitchToSignup}
              style={{
                padding: 0,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Đăng ký ngay
            </Button>
          </div>
        </Form>
      ) : (
        // Forgot Password Flow
        <>
          {forgotStep === 1 && (
            <Form<ForgotEmailFormValues>
              name="forgot_email_form"
              onFinish={onForgotEmailFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <div
                style={{
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                }}
              >
                <Typography.Text style={{ color: "#389e0d", fontSize: "14px" }}>
                  Nhập email đã đăng ký
                </Typography.Text>
              </div>

              <Form.Item
                label={<Typography.Text strong>Email</Typography.Text>}
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="Nhập email của bạn"
                  prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 32 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isForgotLoading}
                  style={{
                    width: "100%",
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #1890ff, #722ed1)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  Gửi OTP
                </Button>
              </Form.Item>
            </Form>
          )}

          {forgotStep === 2 && (
            <Form<ForgotOtpFormValues>
              name="forgot_otp_form"
              onFinish={onForgotOtpFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label={<Typography.Text strong>Mã OTP</Typography.Text>}
                name="otp"
                rules={[
                  { required: true, message: "Vui lòng nhập mã OTP!" },
                  { len: 6, message: "Mã OTP phải gồm 6 ký tự." },
                ]}
              >
                <Input placeholder="Nhập mã OTP 6 số" maxLength={6} />
              </Form.Item>

              <Form.Item style={{ marginTop: 32 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isForgotLoading}
                  style={{
                    width: "100%",
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #1890ff, #722ed1)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  Xác thực OTP
                </Button>
              </Form.Item>
            </Form>
          )}

          {forgotStep === 3 && (
            <Form<ResetPasswordFormValues>
              name="reset_password_form"
              onFinish={onResetPasswordFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label={<Typography.Text strong>Mật khẩu mới</Typography.Text>}
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  {
                    validator: (_, value) => {
                      const errorMessage = validatePassword(value || "");
                      return errorMessage
                        ? Promise.reject(new Error(errorMessage))
                        : Promise.resolve();
                    },
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
              <Form.Item
                label={
                  <Typography.Text strong>Xác nhận mật khẩu</Typography.Text>
                }
                name="confirm_password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu mới" />
              </Form.Item>

              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isForgotLoading}
                  style={{
                    width: "100%",
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #1890ff, #722ed1)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
            </Form>
          )}

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Button
              type="link"
              onClick={handleBackToLogin}
              style={{
                padding: 0,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              ← Quay lại đăng nhập
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default LoginModal;
