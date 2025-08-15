'use client';
import React from 'react';
import { Typography, Result, Button, Card } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Page() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--color-bgBase)',
        padding: '24px'
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          width: '100%',
          background: 'var(--color-bgContainer)',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Result 
          icon={<SmileOutlined style={{ color: 'var(--color-info)' }} />}
          title={
            <Title level={2} style={{ color: 'var(--color-textBase)', margin: 0 }}>
              Trang này đang được phát triển
            </Title>
          }
          subTitle={
            <Paragraph type="secondary" style={{ color: 'var(--color-textSecondary)' }}>
              Chúng tôi đang nỗ lực hoàn thiện nội dung cho trang này. Vui lòng quay lại sau nhé!
            </Paragraph>
          }
          extra={
            <Button type="primary" href="/">
              Quay về trang chủ
            </Button>
          }
        />
      </Card>
    </div>
  );
}
