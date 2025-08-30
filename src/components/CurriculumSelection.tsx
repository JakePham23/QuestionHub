import { Typography, Row, Col, Select, Space, Spin, Alert, Button, Card, Grid } from 'antd';
import { BookOutlined, CodeOutlined, ExperimentOutlined } from '@ant-design/icons';
import React from 'react';

// Import các kiểu dữ liệu từ file type trung tâm
import { GradeItem, SubjectItem, ChapterItem } from '@/types/data.type';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface CurriculumSelectionProps {
  loading: boolean;
  error: string | null;
  grades: GradeItem[];
  subjects: SubjectItem[];
  chapters: ChapterItem[];
  selectedGradeId: string | number | null;
  selectedSubjectId: string | number | null;
  selectedChapterId: string | number | null;
  handleGradeSelect: (gradeId: string | number) => void;
  handleSubjectSelect: (subjectId: string | number) => void;
  setSelectedChapterId: (chapterId: string | number) => void;
}

// Hàm helper để lấy icon môn học
const getSubjectIcon = (subjectName: string) => {
  if (subjectName.toLowerCase().includes('toán')) return <CodeOutlined />;
  if (subjectName.toLowerCase().includes('lý')) return <ExperimentOutlined />;
  if (subjectName.toLowerCase().includes('hóa')) return <BookOutlined />;
  return <BookOutlined />;
};

const CurriculumSelection: React.FC<CurriculumSelectionProps> = ({
  loading,
  error,
  grades,
  subjects,
  chapters,
  selectedGradeId,
  selectedSubjectId,
  selectedChapterId,
  handleGradeSelect,
  handleSubjectSelect,
  setSelectedChapterId,
}) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm;

  return (
    <div 
      id="selection" 
      className="curriculum-selection"
      style={{
        minHeight: '100vh',
        padding: isMobile ? '16px 12px' : '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      {/* Background Elements */}
      <div className="bg-pattern" />
      
      <div className="main-container" style={{
        maxWidth: isMobile ? '100%' : '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        flex: 1,
        width: '100%'
      }}>
        {/* Header Section */}
        <div className="header-wrapper" style={{
          marginBottom: isMobile ? '24px' : '48px',
          textAlign: 'center',
          animation: 'slideUp 0.8s ease-out',
        }}>
          <Title level={1} className="primary-title">
            Khám phá hành trình
            <span className="highlight-text"> học tập của bạn</span>
          </Title>
          
          <Text className="description">
            Tùy chỉnh trải nghiệm học tập theo cấp độ và sở thích cá nhân
          </Text>
        </div>

        {loading && (
          <div className="spinner-wrapper">
            <div className="spinner-container">
              <Spin size="large" />
            </div>
            <div className="spinner-text">Đang tải dữ liệu...</div>
          </div>
        )}
        
        {error && (
          <Alert 
            message="Có lỗi xảy ra" 
            description={error} 
            type="error" 
            showIcon 
            className="alert-message"
          />
        )}

        {!loading && !error && (
          <div className="content-wrapper">
            <Row gutter={[16, 16]} justify="center" align="top">
              {/* 1. Chọn Lớp học */}
              <Col xs={24} md={7}>
                <Card className={`step-card ${selectedGradeId ? 'card-active' : ''}`}>                  
                  <div className="card-inner">
                    <div className={`number-badge ${selectedGradeId ? 'badge-active' : ''}`}>
                      1
                    </div>
                    
                    <Title level={5} className={`card-title ${selectedGradeId ? 'title-active' : ''}`}>
                      Chọn Lớp học
                    </Title>
                    
                    <div className="button-group">
                      {grades.map(grade => (
                        <Button
                          key={grade.id}
                          type={selectedGradeId === grade.id ? 'primary' : 'default'}
                          size={isMobile ? 'middle' : 'middle'}
                          onClick={() => handleGradeSelect(grade.id)}
                          className={`choice-btn ${selectedGradeId === grade.id ? 'btn-selected' : ''}`}
                        >
                          {grade.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>

              {/* 2. Chọn Môn học */}
              <Col xs={24} md={7}>
                <Card className={`step-card ${selectedSubjectId ? 'card-active' : ''} ${!selectedGradeId ? 'card-disabled' : ''}`}>                  
                  <div className="card-inner">
                    <div className={`number-badge ${selectedSubjectId ? 'badge-active' : ''}`}>
                      2
                    </div>
                    
                    <Title level={5} className={`card-title ${selectedSubjectId ? 'title-active' : ''}`}>
                      Chọn Môn học
                    </Title>
                    
                    {subjects.length > 0 ? (
                      <div className="button-group">
                        {subjects.map(subject => (
                          <Button
                            key={subject.id}
                            type={selectedSubjectId === subject.id ? 'primary' : 'default'}
                            size={isMobile ? 'middle' : 'middle'}
                            icon={getSubjectIcon(subject.name)}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className={`choice-btn ${selectedSubjectId === subject.id ? 'btn-selected' : ''}`}
                          >
                            {subject.name}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="placeholder-state">
                        <Text type="secondary">
                          Vui lòng chọn lớp học trước
                        </Text>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>

              {/* 3. Chọn Chương */}
              <Col xs={24} md={7}>
                <Card className={`step-card ${selectedChapterId ? 'card-active' : ''} ${!selectedSubjectId ? 'card-disabled' : ''}`}>                  
                  <div className="card-inner">
                    <div className={`number-badge ${selectedChapterId ? 'badge-active' : ''}`}>
                      3
                    </div>
                    
                    <Title level={5} className={`card-title ${selectedChapterId ? 'title-active' : ''}`}>
                      Chọn Chương
                    </Title>
                    
                    <Select
                      className="dropdown-select"
                      size="middle"
                      placeholder="Chọn chương học"
                      value={selectedChapterId}
                      onChange={(value) => setSelectedChapterId(value)}
                      disabled={!selectedGradeId || !selectedSubjectId || chapters.length === 0}
                    >
                      {chapters.map(chapter => (
                        <Option key={chapter.chapter_id} value={chapter.chapter_id}>
                          <div className="dropdown-item">
                            <div className="item-title">
                              {chapter.chapter_name}
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                    
                    {!selectedGradeId || !selectedSubjectId ? (
                      <div className="placeholder-state">
                        <Text type="secondary">
                          Hoàn thành các bước trước
                        </Text>
                      </div>
                    ) : chapters.length === 0 ? (
                      <div className="placeholder-state">
                        <Text type="secondary">
                          Không có chương nào
                        </Text>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>

      <style jsx>{`
        .curriculum-selection {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 100%
          );
          overflow-x: hidden;
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 0),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 2px, transparent 0);
          background-size: 80px 80px;
          z-index: 1;
        }

        .bg-pattern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(147, 51, 234, 0.1) 100%
          );
        }

        .main-container {
          position: relative;
          z-index: 2;
        }

        .header-wrapper {
          text-align: center;
          animation: slideUp 0.8s ease-out;
        }

        .primary-title {
          color: white !important;
          font-size: clamp(1.4rem, 6vw, 3rem) !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          margin-bottom: 12px !important;
          animation: slideUp 0.8s ease-out 0.4s both;
        }

        .highlight-text {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }

        .description {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: clamp(14px, 4vw, 18px) !important;
          line-height: 1.5 !important;
          max-width: 90% !important;
          margin: 0 auto !important;
          animation: slideUp 0.8s ease-out 0.6s both;
        }

        .spinner-wrapper {
          text-align: center;
          padding: 60px 0;
          animation: fadeInScale 0.5s ease-out;
        }

        .spinner-container {
          margin-bottom: 20px;
        }

        .spinner-text {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 500;
        }

        .alert-message {
          margin-bottom: 24px;
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          animation: slideUp 0.5s ease-out;
        }

        .content-wrapper {
          position: relative;
          animation: slideUp 0.8s ease-out 0.8s both;
        }

        .step-card {
          border-radius: 16px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
          margin-bottom: 16px !important;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%);
          transition: background 0.3s ease;
        }

        .step-card.card-active {
          background: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 8px 32px rgba(96, 165, 250, 0.15) !important;
          border: 2px solid rgba(96, 165, 250, 0.2) !important;
          transform: translateY(-2px);
        }

        .step-card.card-active::before {
          background: linear-gradient(90deg, #60A5FA 0%, #F472B6 100%);
        }

        .step-card:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-1px);
        }

        .step-card.card-disabled {
          opacity: 0.6;
          pointer-events: none;
          filter: grayscale(0.2);
        }

        .card-inner {
          padding: 20px 16px !important;
          text-align: center;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 16px !important;
          min-height: 200px !important;
        }

        .number-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .number-badge.badge-active {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(96, 165, 250, 0.4);
          transform: scale(1.05);
        }

        .card-title {
          margin: 0 !important;
          color: #666 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          transition: color 0.3s ease !important;
          flex-shrink: 0;
        }

        .card-title.title-active {
          color: #60A5FA !important;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
          flex: 1;
          align-content: flex-start;
        }
        
        .choice-btn {
          border-radius: 10px !important;
          font-weight: 600 !important;
          height: 36px !important;
          font-size: 13px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: 2px solid #e8e8e8 !important;
          padding: 0 12px !important;
          background: white !important;
          color: #666 !important;
          min-width: auto !important;
          flex-shrink: 0;
        }

        .choice-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1) !important;
          border-color: #d0d0d0 !important;
        }
        
        .choice-btn.btn-selected {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%) !important;
          border-color: transparent !important;
          color: white !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 16px rgba(96, 165, 250, 0.3) !important;
          transform: translateY(-1px) !important;
        }

        .dropdown-select {
          width: 100% !important;
        }

        .dropdown-select .ant-select-selector {
          border-radius: 10px !important;
          border: 2px solid #e8e8e8 !important;
          height: 40px !important;
          padding: 6px 12px !important;
          transition: all 0.3s ease !important;
        }

        .dropdown-select:hover .ant-select-selector {
          border-color: #d0d0d0 !important;
        }

        .dropdown-select.ant-select-focused .ant-select-selector {
          border-color: #60A5FA !important;
          box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.1) !important;
        }

        .dropdown-item {
          padding: 2px 0;
        }

        .item-title {
          font-size: 13px;
          color: #444;
          font-weight: 500;
          line-height: 1.3;
        }

        .placeholder-state {
          padding: 16px 8px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(249, 249, 249, 0.5);
          border-radius: 10px;
          border: 2px dashed #e0e0e0;
          flex: 1;
          width: 100%;
        }

        .placeholder-state .ant-typography {
          font-size: 13px !important;
          line-height: 1.4 !important;
          color: #999 !important;
          font-weight: 500 !important;
          text-align: center !important;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Mobile-first responsive design */
        @media (max-width: 768px) {
          .curriculum-selection {
            padding: 16px 12px !important;
          }

          .header-wrapper {
            margin-bottom: 20px !important;
          }

          .primary-title {
            font-size: 1.4rem !important;
            margin-bottom: 8px !important;
          }

          .description {
            font-size: 14px !important;
            max-width: 95% !important;
          }

          .card-inner {
            padding: 16px 12px !important;
            gap: 12px !important;
            min-height: 180px !important;
          }

          .number-badge {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }

          .card-title {
            font-size: 15px !important;
          }

          .choice-btn {
            height: 32px !important;
            font-size: 12px !important;
            padding: 0 10px !important;
          }
          
          .button-group {
            gap: 6px;
          }
        }

        @media (max-width: 480px) {
          .curriculum-selection {
            padding: 12px 8px !important;
          }

          .primary-title {
            font-size: 1.25rem !important;
          }

          .description {
            font-size: 13px !important;
          }

          .card-inner {
            padding: 14px 10px !important;
            gap: 10px !important;
            min-height: 160px !important;
          }
          
          .number-badge {
            width: 32px;
            height: 32px;
            font-size: 13px;
          }

          .card-title {
            font-size: 14px !important;
          }

          .choice-btn {
            height: 30px !important;
            font-size: 11px !important;
            padding: 0 8px !important;
          }

          .dropdown-select .ant-select-selector {
            height: 36px !important;
            padding: 4px 10px !important;
          }
        }

        @media (max-width: 375px) {
          .curriculum-selection {
            padding: 10px 6px !important;
          }

          .card-inner {
            padding: 12px 8px !important;
            min-height: 150px !important;
          }

          .choice-btn {
            height: 28px !important;
            font-size: 10px !important;
            padding: 0 6px !important;
          }

          .button-group {
            gap: 4px;
          }
        }

        /* Tablet và desktop */
        @media (min-width: 769px) {
          .step-card {
            height: 320px !important;
          }

          .card-inner {
            padding: 24px 20px !important;
            min-height: auto !important;
          }

          .number-badge {
            width: 48px;
            height: 48px;
            font-size: 18px;
          }

          .card-title {
            font-size: 18px !important;
          }

          .choice-btn {
            height: 40px !important;
            font-size: 14px !important;
            padding: 0 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CurriculumSelection;