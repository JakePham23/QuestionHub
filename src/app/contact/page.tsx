'use client';

import { Layout, Typography, Card, Row, Col, Button, Divider } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  MessageOutlined,
  CustomerServiceOutlined, 
  BulbFilled
} from '@ant-design/icons';
const  Content  = Layout;
const { Title, Paragraph, Text } = Typography;
const Page: React.FC = () => {
  const contactInfo = [
    {
      icon: <MailOutlined style={{fontSize: '24px', color: 'blue'}}></MailOutlined>,
      title: 'Email',
      content: 'papham069@gmail.com',
      description: "Gửi email cho chúng tôi bất cứ lúc nào"
    }, {
      icon: <PhoneOutlined style={{fontSize: '24px', color: 'green'}}></PhoneOutlined>,
      title: 'Số điện thoại',
      content: '+(84) 813551572',
      description: 'Liên hệ trực tiếp qua số điện thoại'
    },  {
      icon: <EnvironmentOutlined style={{fontSize: '24px', color: 'red'}}></EnvironmentOutlined>,
      title: 'Địa chỉ',
      content: 'Việt Nam',
      description: 'Văn phòng chính của chúng tôi'
    }, {
      icon: <ClockCircleOutlined style={{fontSize: '24px', color: 'purple'}}></ClockCircleOutlined>,
      title: "Giờ làm việc",
      content: "Bất cứ khi nào bạn rảnh thì tôi bận nhé",
      description: 'Liên hệ với chúng tôi vào thời gian này nha'
    },
  ]
  return (
    <Layout style={{minHeight: '100vh'}}>
      <Content style={{padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgb(103,123,231) 0%, #ff7eb3 100%)'}}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title style={{fontSize: 32, fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)',marginBottom: '16px'}}> 
            Liên hệ với chúng tôi
          </Title>
          {/* max width -> phù hợp giao diện lớn và cho nó xuống dòng  */}
          <Paragraph style={{fontSize: 16, color: 'white',maxWidth: '600px', margin: '0 auto'}}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua bất kỳ phương thức nào dưới đây.
          </Paragraph>
        </div>

        {/* info section */}
          {/* gutter -> khoảng cách các hàng và cột */}
          <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
            {contactInfo.map((item, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    height: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: 'none',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',

                  }}

                  hoverable
                  className="contact-card"
                >
                  <div style={{ marginBottom: '16px' }}>
                    {item.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: '8px', color: '#262626' }}>
                    {item.title}
                  </Title>
                  <Text strong style={{ fontSize: '16px', color: '#1890ff', display: 'block', marginBottom: '8px' }}>
                    {item.content}
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    {item.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CTA Section */}
          <Card
            style={{
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)'
            }}
          >
            <MessageOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '24px' }} />
            <Title level={2} style={{ marginBottom: '16px', color: '#262626' }}>
              Bạn cần hỗ trợ?
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#595959', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn. 
              Chúng tôi cam kết phản hồi trong vòng 24 giờ.
            </Paragraph>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                type="primary" 
                size="large"
                icon={<MailOutlined />}
                style={{ 
                  borderRadius: '25px',
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  fontSize: '16px',
                  background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(24,144,255,0.3)'
                }}
                href="mailto:papham069@gmail.com"
              >
                Gửi Email
              </Button>
              <Button 
                size="large"
                icon={<PhoneOutlined />}
                style={{ 
                  borderRadius: '25px',
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  fontSize: '16px',
                  borderColor: '#1890ff',
                  color: '#1890ff',
                  background: 'white'
                }}
                href="tel:+84813551572"
              >
                Gọi điện
              </Button>
            </div>

            <Divider style={{ margin: '32px 0' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CustomerServiceOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
              <Text style={{ fontSize: '16px', color: '#595959' }}>
                Chúng tôi luôn sẵn lòng lắng nghe và phản hồi trong thời gian sớm nhất
              </Text>
            </div>
          </Card>
        </div>
      </Content>
      <style jsx global>{`
        .contact-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 48px rgba(0,0,0,0.15) !important;
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }
        
        @media (max-width: 768px) {
          .ant-typography h1 {
            font-size: 36px !important;
          }
        }
      `}</style>
    </Layout>
  )
}

export default Page;

//