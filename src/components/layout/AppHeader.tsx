
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BulbOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";
import {
  Menu,
  Layout,
  Button,
  Input,
  Space,
  Typography,
  Avatar,
  Grid,
  Dropdown,
} from "antd";
const { Header } = Layout;
import LoginModal from "../auth/LoginModal";
import { JSX } from "react/jsx-runtime";
import SignupModal from "../auth/SignupModal";
import { usePathname } from "next/navigation";

import { useContext } from "react";
import { LOCAL_STORAGE_KEY } from "../../providers/AntdConfigProvider";
import { ThemeMode, ThemeModeContext } from "../../providers/ThemeModeContext";
const { useBreakpoint } = Grid;
import authService from "@/services/auth.service";

type User = {
  id?: string | number;
  name?: string;
  username?: string;
  profilePicture?: string;
};

type NavItem = {
  key: string;
  label: React.ReactNode;
};

// Cập nhật navItems để key tương ứng với pathname
const navItems: NavItem[] = [
  { key: "/", label: <Link href="/">Trang chủ</Link> },
  { key: "/about", label: <Link href="/about">Giới thiệu</Link> },
  { key: "/contact", label: <Link href="/contact">Liên hệ</Link> },
  { key: "/blog", label: <Link href="/blog">Bản tin học tập</Link> },
  { key: "/exercises", label: <Link href="/exercises">Luyện tập</Link> },
];

export default function AppHeader(): JSX.Element {
  const pathname = usePathname(); // Lấy pathname hiện tại từ hook của Next.js
  const screens = useBreakpoint();
  const isMobile = screens.md === false;
  const { mode, setMode } = useContext(ThemeModeContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // set selectedKey dựa trên pathname hiện tại
  const [selectedKey, setSelectedKey] = useState(pathname);

  // Đồng bộ selectedKey với URL khi pathname thay đổi
  useEffect(() => {
    setSelectedKey(pathname);
    document.documentElement.setAttribute("data-theme", mode);

    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        setCurrentUser(JSON.parse(userString) as User);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.clear();
      }
    }
  }, [mode, pathname]);

  const handleLoginSuccess = (user: User) => {
    setIsLoginModalOpen(false);
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogoutSuccess = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const onSelectHandler = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          position: "sticky",
          top: 0,
          zIndex: 10,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--color-bgContainer)",
        }}
      >
        <div
        suppressHydrationWarning
          className="logo"
          style={{ marginTop: "4px", display: "flex", alignItems: "center" }}
        >
          <Button
            type="text"
            style={{
              padding: 0,
              marginRight: 8,
              backgroundColor: "transparent",
              borderColor: "transparent",
              boxShadow: "none",
            }}
            onClick={() => {
              const newMode =
                mode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
              localStorage.setItem(LOCAL_STORAGE_KEY, newMode);
              setMode(newMode);
            }}
          >
            <BulbOutlined
              style={{
                fontSize: "26px",
                color: "var(--color-info)",
              }}
            />
          </Button>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            {!isMobile && (
              <Typography.Title
                level={3}
                style={{ color: "var(--color-info)", margin: "0 0 0 0" }}
              >
                Question Hub
              </Typography.Title>
            )}
          </Link>
        </div>

        {!isMobile ? (
          <Menu
            mode="horizontal"
            items={navItems}
            selectedKeys={[selectedKey]}
            onSelect={onSelectHandler}
            style={{
              backgroundColor: "var(--color-bgContainer)",
              flex: 1,
              borderBottom: "none",
              justifyContent: "center",
              borderColor: "var(--color-bgContainer)",
              fontWeight: "700",
              minWidth: "0px",
            }}
          />
        ) : (
          <Dropdown menu={{ items: navItems }} placement="bottomRight" arrow>
            <Button
              type="text"
              icon={<MenuOutlined />}
              style={{ fontSize: "20px" }}
            />
          </Dropdown>
        )}

        <Space style={{ marginLeft: "24px" }} size="middle">
          <Input.Search
            style={{
              marginTop: "15px",
              borderRadius: "2rem",
            }}
            placeholder="Tìm kiếm câu hỏi..."
            allowClear
          />

          {currentUser ? (
            <>
              <Avatar
                icon={<UserOutlined />}
                src={currentUser.profilePicture}
              />
              {!isMobile && (
                <Typography.Text
                  strong
                  style={{ color: "var(--color-textBase)" }}
                >
                  {currentUser.name || currentUser.username}
                </Typography.Text>
              )}
              <Button
                style={{ borderRadius: "2rem" }}
                onClick={handleLogoutSuccess}
              >
                {!isMobile ? "Đăng xuất" : <UserOutlined />}
              </Button>
            </>
          ) : (
            <>
              <Button
                style={{ borderRadius: "2rem", color: "var(--color-textBase)" }}
                onClick={() => setIsLoginModalOpen(true)}
              >
                {!isMobile ? "Đăng nhập" : <UserOutlined />}
              </Button>
              {!isMobile && (
                <Button
                  style={{
                    borderRadius: "2rem",
                    backgroundColor: "var(--color-info)",
                    borderColor: "var(--color-info)",
                    borderBottom: "none",
                  }}
                  type="primary"
                  onClick={() => setIsSignupModalOpen(true)}
                >
                  Đăng ký
                </Button>
              )}
            </>
          )}
        </Space>

        <LoginModal
          open={isLoginModalOpen}
          onCancel={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={switchToSignup}
        />

        <SignupModal
          open={isSignupModalOpen}
          onCancel={() => setIsSignupModalOpen(false)}
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={switchToLogin}
        />
      </Header>
    </>
  );
}
