'use client';

import React, { useState } from 'react';
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
  Badge
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

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Exercise {
  id: number;
  title: string;
  description: string;
  subject: string; // môn học
  grade: string; // lớp
  chapter: string; // chương
  topic?: string; // chuyên đề
  type: string; // dạng bài tập
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
  timeLimit: number; // minutes
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  completedAt?: string;
  attempts: number;
}

const ExerciseDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Dữ liệu mẫu bài tập
  const exercises: Exercise[] = [
    {
      id: 1,
      title: "Hàm số bậc nhất và bậc hai",
      description: "Bài tập về đồ thị, tính chất và ứng dụng của hàm số bậc nhất, bậc hai",
      subject: "Toán",
      grade: "Lớp 10",
      chapter: "Chương 2",
      topic: "Hàm số",
      type: "Trắc nghiệm",
      difficulty: "medium",
      totalQuestions: 20,
      timeLimit: 45,
      status: "completed",
      score: 85,
      completedAt: "2024-08-25",
      attempts: 2
    },
    {
      id: 2,
      title: "Định luật Newton và ứng dụng",
      description: "Các bài tập vận dụng 3 định luật Newton trong các tình huống thực tế",
      subject: "Vật lý",
      grade: "Lớp 10",
      chapter: "Chương 3",
      topic: "Động lực học",
      type: "Tự luận",
      difficulty: "hard",
      totalQuestions: 15,
      timeLimit: 60,
      status: "in_progress",
      score: 60,
      attempts: 1
    },
    {
      id: 3,
      title: "Cân bằng hóa học và tốc độ phản ứng",
      description: "Bài tập về cân bằng hóa học, các yếu tố ảnh hưởng và tính toán",
      subject: "Hóa học",
      grade: "Lớp 11",
      chapter: "Chương 4",
      topic: "Cân bằng hóa học",
      type: "Trắc nghiệm",
      difficulty: "medium",
      totalQuestions: 25,
      timeLimit: 50,
      status: "not_started",
      attempts: 0
    },
    {
      id: 4,
      title: "Di truyền học cơ bản",
      description: "Các quy luật di truyền Mendel và bài tập tính toán tỷ lệ kiểu hình",
      subject: "Sinh học",
      grade: "Lớp 12",
      chapter: "Chương 1",
      topic: "Di truyền học",
      type: "Trắc nghiệm",
      difficulty: "medium",
      totalQuestions: 30,
      timeLimit: 40,
      status: "completed",
      score: 92,
      completedAt: "2024-08-20",
      attempts: 1
    },
    {
      id: 5,
      title: "Thì và cách dùng trong tiếng Anh",
      description: "Bài tập về các thì cơ bản và cách sử dụng trong câu",
      subject: "Tiếng Anh",
      grade: "Lớp 11",
      chapter: "Grammar",
      topic: "Ngữ pháp",
      type: "Trắc nghiệm",
      difficulty: "easy",
      totalQuestions: 40,
      timeLimit: 35,
      status: "in_progress",
      score: 70,
      attempts: 1
    },
    {
      id: 6,
      title: "Chiến tranh thế giới thứ hai",
      description: "Các sự kiện quan trọng và tác động của chiến tranh thế giới thứ hai",
      subject: "Lịch sử",
      grade: "Lớp 12",
      chapter: "Chương 6",
      topic: "Lịch sử thế giới",
      type: "Tự luận",
      difficulty: "hard",
      totalQuestions: 10,
      timeLimit: 90,
      status: "not_started",
      attempts: 0
    }
  ];

  const subjects = ['all', 'Toán', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 'Lịch sử'];
  const grades = ['all', 'Lớp 10', 'Lớp 11', 'Lớp 12'];
  const types = ['all', 'Trắc nghiệm', 'Tự luận', 'Thực hành'];
  const statuses = ['all', 'not_started', 'in_progress', 'completed'];

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || exercise.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || exercise.grade === selectedGrade;
    const matchesType = selectedType === 'all' || exercise.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || exercise.status === selectedStatus;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesType && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedExercises = filteredExercises.slice(startIndex, endIndex);

  // Statistics
  const totalExercises = exercises.length;
  const completedExercises = exercises.filter(ex => ex.status === 'completed').length;
  const inProgressExercises = exercises.filter(ex => ex.status === 'in_progress').length;
  const averageScore = exercises
    .filter(ex => ex.score !== undefined)
    .reduce((sum, ex) => sum + (ex.score || 0), 0) / 
    exercises.filter(ex => ex.score !== undefined).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'processing';
      case 'not_started': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'in_progress': return 'Đang làm';
      case 'not_started': return 'Chưa bắt đầu';
      default: return status;
    }
  };

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
                {subjects.slice(1).map(subject => (
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
                {grades.slice(1).map(grade => (
                  <Option key={grade} value={grade}>{grade}</Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Text strong>Dạng bài:</Text>
              <Select
                value={selectedType}
                onChange={setSelectedType}
                style={{ width: '100%', marginTop: '4px' }}
              >
                <Option value="all">Tất cả</Option>
                {types.slice(1).map(type => (
                  <Option key={type} value={type}>{type}</Option>
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
                          {exercise.difficulty === 'easy' ? 'Dễ' : 
                           exercise.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
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
                            // status={exercise.score >= 80 ? 'success' : exercise.score >= 60 ? 'normal' : 'exception'}
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