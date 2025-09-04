'use client';

import React, { useState, useEffect } from 'react';
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
  Badge,
  Alert,
  Spin
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { getExerciseTopics } from '@/services/exercise.service';
import { TopicExerciseInfo, ExerciseStatus, Difficulty, Exercise } from '@/types/exercise.type';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ExerciseDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<ExerciseStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Giả định userGradeId được lấy từ context người dùng sau khi đăng nhập
  const userGradeId = 12; // Lớp 12
  const userGradeName = "Lớp 12"; // Tên lớp tương ứng

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        const response = await getExerciseTopics();
        if (response.metadata) {
          const fetchedTopics = response.metadata.map(item => ({
            ...item, // Giữ nguyên các thuộc tính từ TopicExerciseInfo
            id: item.topic_id,
            title: item.topic_name,
            description: item.topic_description,
            subject: item.subject_name,
            grade: item.grade_name,
            chapter: item.chapter_name,
            topic: item.topic_name,
            difficulty: 'nhan_biet' as Difficulty,
            totalQuestions: 0,
            status: 'not_started' as ExerciseStatus,
            attempts: 0,
            type: 'topic', 
            timeLimit: 0, 
            score: 0,     
          }));
          setAllExercises(fetchedTopics);
          setError(null);

          // Tự động chọn lớp của người dùng làm giá trị mặc định
          setSelectedGrade(userGradeName);
          
        } else {
          setAllExercises([]);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchExerciseData();
  }, []);

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
  const averageScore = allExercises
    .filter(ex => ex.score !== undefined)
    .reduce((sum, ex) => sum + (ex.score || 0), 0) / 
    allExercises.filter(ex => ex.score !== undefined).length;

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'thong_hieu': return 'green';
      case 'nhan_biet': return 'orange';
      case 'van_dung': return 'red';
      case 'van_dung_cao': return 'magenta';
      default: return 'blue';
    }
  };

  const getDifficultyText = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'thong_hieu': return 'Thông hiểu';
      case 'nhan_biet': return 'Nhận biết';
      case 'van_dung': return 'Vận dụng';
      case 'van_dung_cao': return 'Vận dụng cao';
      default: return 'Khác';
    }
  };

  const getStatusColor = (status: ExerciseStatus) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'processing';
      case 'not_started': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: ExerciseStatus) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'in_progress': return 'Đang làm';
      case 'not_started': return 'Chưa bắt đầu';
      default: return status;
    }
  };
  
  // if (loading) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: '50px' }}>
  //       <Spin size="large" tip="Đang tải dữ liệu..." />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Alert message="Lỗi tải dữ liệu" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
          Bài Tập Của Tôi
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '24px' }}>
          Quản lý và theo dõi tiến độ học tập của bạn
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng bài tập"
              value={totalExercises}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={completedExercises}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang thực hiện"
              value={inProgressExercises}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Điểm trung bình"
              value={isFinite(averageScore) ? averageScore.toFixed(1) : 'N/A'}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Search
            placeholder="Tìm kiếm bài tập..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Text strong>Môn học:</Text>
              <Select
                value={selectedSubject}
                onChange={setSelectedSubject}
                style={{ width: '100%', marginTop: '4px' }}
              >
                <Option value="all">Tất cả</Option>
                {uniqueSubjects.map(subject => (
                  <Option key={subject} value={subject}>{subject}</Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Text strong>Lớp:</Text>
              <Select
                value={selectedGrade}
                onChange={setSelectedGrade}
                style={{ width: '100%', marginTop: '4px' }}
              >
                <Option value="all">Tất cả</Option>
                {uniqueGrades.map(grade => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Text strong>Trạng thái:</Text>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: '100%', marginTop: '4px' }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="not_started">Chưa bắt đầu</Option>
                <Option value="in_progress">Đang làm</Option>
                <Option value="completed">Đã hoàn thành</Option>
              </Select>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Exercise List */}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 4,
        }}
        dataSource={paginatedExercises}
        renderItem={(exercise) => (
          <List.Item>
            <Badge.Ribbon text={getStatusText(exercise.status)} color={getStatusColor(exercise.status)}>
              <Card
                hoverable
                actions={[
                  exercise.status === 'not_started' ? (
                    <Button type="primary" icon={<PlayCircleOutlined />} key="start">
                      Bắt đầu
                    </Button>
                  ) : exercise.status === 'in_progress' ? (
                    <Button type="default" icon={<PlayCircleOutlined />} key="continue">
                      Tiếp tục
                    </Button>
                  ) : (
                    <Button type="link" icon={<FileTextOutlined />} key="review">
                      Xem lại
                    </Button>
                  )
                ]}
                style={{ height: '100%' }}
              >
                <Card.Meta
                  title={
                    <Title level={5} ellipsis={{ tooltip: true }} style={{ minHeight: '48px' }}>
                      {exercise.title}
                    </Title>
                  }
                  description={
                    <div>
                      <Text type="secondary" ellipsis={{ tooltip: true }} style={{ display: 'block', minHeight: '40px', marginBottom: '12px' }}>
                        {exercise.description}
                      </Text>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <Tag color="blue">{exercise.subject}</Tag>
                        <Tag color="green">{exercise.grade}</Tag>
                        <Tag color={getDifficultyColor(exercise.difficulty)}>
                          {getDifficultyText(exercise.difficulty)}
                        </Tag>
                      </div>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong>{exercise.chapter}</Text>
                        {exercise.topic && (
                          <Text type="secondary"> • {exercise.topic}</Text>
                        )}
                      </div>
                      
                      <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                        <Space>
                          <Text type="secondary">
                            <FileTextOutlined /> {exercise.totalQuestions} câu
                          </Text>
                          <Text type="secondary">
                            <ClockCircleOutlined /> {exercise.timeLimit} phút
                          </Text>
                        </Space>
                      </div>
                      
                      {exercise.status === 'completed' && (
                        <div style={{ marginTop: '8px' }}>
                          <Text strong>Điểm: {exercise.score}%</Text>
                          <Progress 
                            percent={exercise.score} 
                            size="small" 
                            status={exercise.score >= 80 ? 'success' : exercise.score >= 60 ? 'normal' : 'exception'}
                            showInfo={false}
                          />
                        </div>
                      )}
                      
                      {exercise.status === 'in_progress' && (
                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary">Điểm hiện tại: {exercise.score}%</Text>
                          <Progress 
                            percent={exercise.score} 
                            size="small" 
                            status="active"
                            showInfo={false}
                          />
                        </div>
                      )}
                    </div>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />

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
              `${range[0]}-${range[1]} của ${total} bài tập`
            }
          />
        </div>
      )}

      {/* No results */}
      {filteredExercises.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>😔</div>
          <Title level={4}>Không tìm thấy bài tập nào</Title>
          <Text type="secondary">Hãy thử tìm kiếm với từ khóa khác hoặc chọn bộ lọc khác</Text>
        </div>
      )}
    </div>
  );
};

export default ExerciseDashboard;