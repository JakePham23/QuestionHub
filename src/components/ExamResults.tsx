// src/components/ExamResults.tsx
import { Typography, Row, Col, Card, Button, Spin, Alert, Empty, Tag, Space } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

// Định nghĩa các kiểu dữ liệu
interface Exam {
  exam_id: string;
  title: string;
  description: string;
  total_questions: number;
  duration_minutes: number;
}

interface ExamResultsProps {
  examLoading: boolean;
  examError: string | null;
  exams: Exam[];
  selectedGradeId: string | number | null;
  selectedSubjectId: string | number | null;
}

const ExamResults: React.FC<ExamResultsProps> = ({
  examLoading,
  examError,
  exams,
  selectedGradeId,
  selectedSubjectId,
}) => {
  const hasSelectedAnyFilter = selectedGradeId || selectedSubjectId;

  // Nội dung của thông báo Empty
  const emptyDescription = hasSelectedAnyFilter
    ? (
        <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
          <div style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>
            Đề thi loại này chưa được cập nhật
          </div>
          <div style={{ fontSize: '14px' }}>
            Vui lòng liên hệ Admin hoặc chờ Admin cập nhật thêm nhé!
          </div>
        </div>
      )
    : (
        <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            Vui lòng chọn Lớp học hoặc Môn học để xem đề thi
          </div>
        </div>
      );

  return (
    <div style={{ 
      minHeight: '40vh',
      padding: '40px 24px', 
      backgroundColor: '#f5f5f5',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title 
            level={1} 
            style={{ 
              color: '#1890ff',
              marginBottom: '16px',
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Kho Đề Thi Trực Tuyến
          </Title>
          <Text style={{ fontSize: '16px', color: '#666' }}>
            Chọn đề thi phù hợp và bắt đầu luyện tập ngay hôm nay
          </Text>
        </div>

        {/* Loading State */}
        {examLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0',
            backgroundColor: '#fafafa',
            borderRadius: '12px',
            border: '2px dashed #d9d9d9'
          }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#666' }}>
              Đang tải danh sách đề thi...
            </div>
          </div>
        )}

        {/* Error State */}
        {examError && (
          <Alert 
            message="Có lỗi xảy ra" 
            description={examError} 
            type="error" 
            showIcon 
            style={{
              borderRadius: '12px',
              marginBottom: '24px'
            }}
          />
        )}

        {/* Content */}
        {!examLoading && !examError && (
          <>
            {exams.length > 0 ? (
              <Row gutter={[24, 24]} justify="start">
                {exams.map(exam => (
                  <Col key={exam.exam_id} xs={24} sm={12} lg={8} xl={6}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                      }}
                      actions={[
                        <Link href={`/exam/${exam.exam_id}`} key="start">
                          <Button 
                            type="primary" 
                            icon={<PlayCircleOutlined />}
                            size="large"
                            style={{
                              borderRadius: '8px',
                              fontWeight: '600',
                              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                            }}
                          >
                            Bắt đầu làm bài
                          </Button>
                        </Link>,
                      ]}
                    >
                      <div style={{ flex: 1 }}>
                        <Title 
                          level={4} 
                          style={{ 
                            marginBottom: '12px',
                            color: '#1f2937',
                            fontSize: '18px',
                            fontWeight: '600',
                            lineHeight: '1.4'
                          }}
                          ellipsis={{ rows: 2 }}
                        >
                          {exam.title}
                        </Title>
                        
                        <Paragraph 
                          ellipsis={{ rows: 3 }}
                          style={{ 
                            color: '#6b7280',
                            marginBottom: '16px',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}
                        >
                          {exam.description}
                        </Paragraph>
                      </div>
                      
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tag 
                            icon={<FileTextOutlined />} 
                            color="blue"
                            style={{ borderRadius: '6px', fontWeight: '500' }}
                          >
                            {exam.total_questions} câu hỏi
                          </Tag>
                          <Tag 
                            icon={<ClockCircleOutlined />} 
                            color="green"
                            style={{ borderRadius: '6px', fontWeight: '500' }}
                          >
                            {exam.duration_minutes} phút
                          </Tag>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 40px',
                backgroundColor: '#fafafa',
                borderRadius: '16px',
                border: '2px dashed #d9d9d9',
                marginTop: '40px'
              }}>
                <Empty 
                  description={emptyDescription}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExamResults;