'use client '
import React from 'react';
import { Card, Layout, Row, Col,Avatar, Typography } from 'antd';
import { BookOutlined, TrophyOutlined, UserOutlined, BulbOutlined, StarOutlined, RocketOutlined, LineChartOutlined } from '@ant-design/icons';
import Link from 'next/link'
const Content = Layout;
const Paragraph = Typography;
const Title = Typography;
const Page: React.FC = () => {
    const features = [
    {
      icon: <BookOutlined style={{ fontSize: '48px', color: 'var(--color-info)' }} />,
      title: 'Kho đề thi đa dạng',
      description: 'Bao gồm các đề thi theo từng lớp, từng môn, từng chương, và cả các đề ôn luyện cho kỳ thi THPT Quốc gia.'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '48px', color: 'var(--color-success' }} />,
      title: 'Kết quả chi tiết',
      description: 'Người dùng có thể xem lại kết quả làm bài, đáp án đúng/sai và giải thích chi tiết cho từng câu hỏi.'
    },
    {
      icon: <UserOutlined style={{ fontSize: '48px', color: 'var(--color-purple' }} />,
      title: 'Giao diện thân thiện',
      description: 'Giao diện được thiết kế đơn giản, dễ sử dụng, phù hợp với mọi đối tượng người dùng.'
    }
  ];

  const stats = [
    { icon: <BulbOutlined />, number: '10,000+', label: 'Câu hỏi' },
    { icon: <StarOutlined />, number: '50+', label: 'Môn học' },
    { icon: <UserOutlined />, number: '1,000+', label: 'Học sinh' },
    { icon: <RocketOutlined />, number: '95%', label: 'Hài lòng' }
  ];
  return (
    // full UI 
    <Layout style={{minHeight: '100vh' }}>
        <Content style={{padding: 0}}>
            {/* Hero section */}
                <div style={{
                background: 'var(--gradient-bluePurple)',
                padding: '50px 24px',
                textAlign: 'center',
                color: 'white'
                }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Avatar 
                    size={120} 
                    icon={<BulbOutlined style={{ fontSize: '64px', color: 'white' }} />} // ✅ dùng icon
                    style={{ 
                        marginBottom: '32px',
                        border: '4px solid white',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        backgroundColor: 'transparent'
                    }} 
                    />
                    <Title style={{ color: 'white', fontSize: '48px', marginBottom: '24px', fontWeight: 'bold' }}>
                    QuestionHub
                    </Title>
                    <Paragraph style={{ 
                    fontSize: '20px', 
                    lineHeight: '32px', 
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: '600px',
                    margin: '0 auto'
                    }}>
                    Nền tảng trắc nghiệm trực tuyến hàng đầu, hỗ trợ học sinh và giáo viên trong quá trình học tập và đánh giá
                    </Paragraph>
                </div>
                </div>
        {/* Stats Section */}
        <div style={{ 
          background: 'white', 
          padding: '60px 24px',
          transform: 'translateY(-30px)',
          margin: '0 24px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    color: '#1890ff', 
                    marginBottom: '8px' 
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#262626',
                    marginBottom: '4px'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#8c8c8c' 
                  }}>
                    {stat.label}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Content Section */}
        <div style={{ padding: '60px 24px', background: 'var(--color-bgBase)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Mission Section */}
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title style={{ 
                fontSize: '36px', 
                marginBottom: '24px',
                background: 'var(--gradient-bluePurple)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Sứ mệnh của chúng tôi
              </Title>
              <Paragraph style={{ 
                fontSize: '18px', 
                lineHeight: '32px',
                color: 'var(--color-textSecondary)',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                Chúng tôi tin rằng việc tiếp cận kiến thức nên dễ dàng và hiệu quả. QuestionHub ra đời với sứ mệnh tạo ra một công cụ mạnh mẽ, giúp học sinh tự tin ôn luyện và nắm vững kiến thức, đồng thời cung cấp cho giáo viên một công cụ hữu ích để tạo đề thi và đánh giá kết quả học tập.
              </Paragraph>
            </div>

            {/* Features Section */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <Title style={{ 
                fontSize: '36px', 
                marginBottom: '60px',
                background: 'var(--gradient-bluePurple)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Điểm nổi bật
              </Title>
            </div>

            <Row gutter={[32, 32]} justify="center">
              {features.map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card 
                    style={{ 
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    hoverable
                  >
                    <div style={{ marginBottom: '24px' }}>
                      {feature.icon}
                    </div>
                    <Title style={{ 
                      marginBottom: '16px',
                      color: 'var(--color-textBase)'
                    }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ 
                      fontSize: '16px', 
                      lineHeight: '26px',
                      color: 'var(--color-textSecondary)',
                      margin: 0
                    }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

      
      </Content>
    </Layout>
  );
};

export default Page;
