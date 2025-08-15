'use client';

import React from 'react';
import { Layout, Space } from 'antd';
import Link from 'next/link';
const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Question Hub ©{new Date().getFullYear()} - Nơi hội tụ tri thức, chinh phục mọi kỳ thi.
      <br />
      <Space>
        Theo dõi trên{''}
        <Link href="https://facebook.com" className="text-blue-400 hover:underline">Facebook</Link>
      </Space>
    </Footer>
  );
};

export default AppFooter;