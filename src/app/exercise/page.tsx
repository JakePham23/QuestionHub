'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  List,
  Tag,
  Input,
  Select,
  Typography,
  Space,
  Button,
  Pagination,
  Progress,
  Row,
  Col,
  Statistic,
  Alert,
  Spin,
  Dropdown,
  Empty
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  FilterOutlined,
  DownOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getExerciseTopics } from '@/services/exercise.service';
import { TopicExerciseInfo, ExerciseStatus, Exercise } from '@/types/exercise.type';
import { getStatusText, getStatusColor } from '@/utils/ExerciseStatusConverter';
import { getCardStyle, getButtonColor , } from '@/utils/ColorUtils';

const { Title, Text } = Typography;
const { Search } = Input;



const getStatusBadge = (status: ExerciseStatus) => {
  switch (status) {
    case 'not_started':
      return <Tag color="blue" style={{ borderRadius: 12 }}>Chưa bắt đầu</Tag>;
    case 'in_progress':
      return <Tag color="orange" style={{ borderRadius: 12 }}>Đang thực hiện</Tag>;
    case 'completed':
      return <Tag color="green" style={{ borderRadius: 12 }}>Đã hoàn thành</Tag>;
    default:
      return null;
  }
};

const ExerciseDashboard: React.FC = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<ExerciseStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userGradeName = "Lớp 12";

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        const response = await getExerciseTopics();
        if (response.metadata) {
          const fetchedTopics = response.metadata.map((item: TopicExerciseInfo) => {
            const status = ['not_started', 'in_progress', 'completed'][Math.floor(Math.random() * 3)] as ExerciseStatus;
            return {
              ...item,
              id: item.topic_id,
              title: item.topic_name,
              description: item.topic_description,
              subject: item.subject_name,
              grade: item.grade_name,
              chapter: item.chapter_name,
              topic: item.topic_name,
              totalQuestions: Math.floor(Math.random() * 20) + 10,
              status,
              attempts: Math.floor(Math.random() * 3),
              type: 'topic',
            };
          });
          setAllExercises(fetchedTopics);
          setError(null);
          setSelectedGrade(userGradeName);
        } else {
          setAllExercises([]);
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchExerciseData();
  }, [userGradeName]);

  const uniqueSubjects = Array.from(new Set(allExercises.map(ex => ex.subject)));
  const uniqueGrades = Array.from(new Set(allExercises.map(ex => ex.grade)));

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || exercise.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || exercise.grade === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || exercise.status === selectedStatus;

    return matchesSearch && matchesSubject && matchesGrade && matchesStatus;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedExercises = filteredExercises.slice(startIndex, endIndex);

  const totalExercises = allExercises.length;
  const completedExercises = allExercises.filter(ex => ex.status === 'completed').length;
  const inProgressExercises = allExercises.filter(ex => ex.status === 'in_progress').length;

  const handleStartExercise = (topicId: number) => {
    router.push(`/exercise/${topicId}`);
  };

  const getButtonText = (status: ExerciseStatus) => {
    switch (status) {
      case 'not_started':
        return 'Bắt đầu';
      case 'in_progress':
        return 'Tiếp tục';
      case 'completed':
        return 'Xem lại';
      default:
        return 'Bắt đầu';
    }
  };

  const menu = (
    <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
      <div style={{ marginBottom: '12px' }}>
        <Text strong>Môn học</Text>
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Tag.CheckableTag
            checked={selectedSubject === 'all'}
            onChange={() => setSelectedSubject('all')}
          >
            Tất cả
          </Tag.CheckableTag>
          {uniqueSubjects.map(subject => (
            <Tag.CheckableTag
              key={subject}
              checked={selectedSubject === subject}
              onChange={() => setSelectedSubject(subject)}
            >
              {subject}
            </Tag.CheckableTag>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <Text strong>Lớp</Text>
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Tag.CheckableTag
            checked={selectedGrade === 'all'}
            onChange={() => setSelectedGrade('all')}
          >
            Tất cả
          </Tag.CheckableTag>
          {uniqueGrades.map(grade => (
            <Tag.CheckableTag
              key={grade}
              checked={selectedGrade === grade}
              onChange={() => setSelectedGrade(grade)}
            >
              {grade}
            </Tag.CheckableTag>
          ))}
        </div>
      </div>
      <div>
        <Text strong>Trạng thái</Text>
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Tag.CheckableTag
            checked={selectedStatus === 'all'}
            onChange={() => setSelectedStatus('all')}
          >
            Tất cả
          </Tag.CheckableTag>
          {['not_started', 'in_progress', 'completed'].map(status => (
            <Tag.CheckableTag
              key={status}
              checked={selectedStatus === status}
              onChange={() => setSelectedStatus(status as ExerciseStatus)}
            >
              {getStatusText(status as ExerciseStatus)}
            </Tag.CheckableTag>
          ))}
        </div>
      </div>
    </div>
  );

  // if (loading) {
  //   return (
  //     <div style={{ 
  //       minHeight: '100vh', 
  //       backgroundColor: '#f5f5f5',
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center'
  //     }}>
  //       <Spin size="large" tip="Đang tải dữ liệu..." />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '50px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Alert message="Lỗi tải dữ liệu" description={error} type="error" showIcon />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{ 
            color: '#262626',
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            Bài Tập Của Tôi
          </Title>
          <Text style={{ 
            color: '#8c8c8c', 
            fontSize: '16px'
          }}>
            Quản lý và theo dõi tiến độ học tập của bạn
          </Text>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '8px' }}>
                <BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                Tổng bài tập
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                {totalExercises}
              </div>
            </Card>
          </Col>
          
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '8px' }}>
                <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                Đã hoàn thành
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                {completedExercises}
              </div>
            </Card>
          </Col>
          
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '8px' }}>
                <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                Đang thực hiện
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>
                {inProgressExercises}
              </div>
            </Card>
          </Col>
          
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '8px' }}>
                <TrophyOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                Điểm trung bình
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>
                9.9
              </div>
            </Card>
          </Col>
        </Row>

        {/* Search and Filter */}
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Search
            placeholder="Tìm kiếm bài tập..."
            allowClear
            size="large"
            onSearch={setSearchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', maxWidth: '600px' }}
          />
          <Dropdown 

            overlay={menu}
            trigger={['click']}
          >
            <Button size="large" style={{ 
              borderRadius: '1rem', 
              boxShadow: '0 2px 0 rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FilterOutlined /> Bộ lọc nâng cao <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        {/* Exercise List */}
        {paginatedExercises.length > 0 ? (
          <List
            grid={{
              gutter: [24, 24],
              xs: 1,
              sm: 1,
              md: 2,
              lg: 3,
              xl: 3,
            }}
            dataSource={paginatedExercises}
            renderItem={(exercise) => (
              <List.Item>
                <Card
                  style={{
                    borderRadius: '12px',
                    height: '100%',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    ...getCardStyle(exercise.status),
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    {getStatusBadge(exercise.status)}
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <Tag color="blue">{exercise.subject}</Tag>
                    <Tag color="cyan">{exercise.grade}</Tag>
                  </div>

                  <Title level={4} style={{ marginBottom: '8px' }}>
                    {exercise.title}
                  </Title>
                  <Text type="secondary" style={{ marginBottom: '16px' }}>
                    {exercise.chapter}
                  </Text>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <Space size="small" style={{ marginRight: '16px' }}>
                      <FileTextOutlined style={{ color: '#8c8c8c' }} />
                      <Text type="secondary">{exercise.totalQuestions} câu</Text>
                    </Space>

                  </div>

                {/* thuộc tính tiến độ chưa có */}
                  {/* {(
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Text type="secondary">
                          Tiến độ:
                        </Text>
                        <Text strong>
                          {exercise.score}%
                        </Text>
                      </div>
                      <Progress 
                        percent={exercise.score} 
                        size="small" 
                        status={exercise.score >= 80 ? 'success' : 'active'}
                        showInfo={false}
                      />
                    </div>
                  )} */}

                  <div style={{ marginTop: 'auto' }}>
                    <Button
                      block
                      size="large"
                      onClick={() => handleStartExercise(exercise.id)}
                      style={{
                        borderRadius: '1rem',
                        height: '48px',
                        ...getButtonColor(exercise.status),
                        color: '#fff',
                        fontWeight: 500
                      }}
                    >
                      {getButtonText(exercise.status)}
                    </Button>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Card style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            border: '1px solid #f0f0f0',
            borderRadius: '8px'
          }}>
            <Empty
              description={
                <div>
                  <Title level={4} style={{ color: '#8c8c8c' }}>
                    Không tìm thấy bài tập nào
                  </Title>
                  <Text type="secondary">
                    Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                  </Text>
                </div>
              }
            />
          </Card>
        )}

        {/* Pagination */}
        {filteredExercises.length > pageSize && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Pagination
              current={currentPage}
              total={filteredExercises.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bài tập`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDashboard;