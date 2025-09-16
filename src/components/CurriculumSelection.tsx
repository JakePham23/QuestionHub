import { Typography, Row, Col, Select, Space, Spin, Alert, Button, Card } from 'antd';
import { BookOutlined, CodeOutlined, ExperimentOutlined } from '@ant-design/icons';
import React from 'react';

// Import các kiểu dữ liệu từ file type trung tâm
import { GradeItem, SubjectItem, ChapterItem } from '@/types/data.type';

const { Title, Text } = Typography;
const { Option } = Select;

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
  return (
    <div 
      id="selection" 
      className="curriculum-selection"
    >
      {/* Background Elements */}
      <div className="bg-pattern" />
      
      <div className="main-container">
        {/* Header Section */}
        <div className="header-wrapper">
          <Title level={1} className="primary-title">
            Khám phá hành trình
            <span className="highlight-text"> học tập của bạn</span>
          </Title>
          
          <Text className="description">
            Tùy chỉnh trải nghiệm học tập theo cấp độ và sở thích cá nhân
          </Text>
        </div>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner-container">
              <Spin size="large" />
            </div>
            <div className="spinner-text">Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <Alert
            message="Không thể tải dữ liệu chương trình học"
            description={error}
            type="error"
            showIcon
            className="alert-message"
            action={
              <Button size="small" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        ) : (
          <div className="content-wrapper">
            {/* phần chọn lớp - môn - chương như bạn đã có */}
          </div>
        )}


        {!loading && !error && (
          <div className="content-wrapper">
            <Row gutter={[24, 24]} justify="center" align="top">
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
                    
                    <Space wrap size="small" className="button-group">
                      {grades.map(grade => (
                        <Button
                          key={grade.id}
                          type={selectedGradeId === grade.id ? 'primary' : 'default'}
                          size="middle"
                          onClick={() => handleGradeSelect(grade.id)}
                          className={`choice-btn ${selectedGradeId === grade.id ? 'btn-selected' : ''}`}
                        >
                          {grade.name}
                        </Button>
                      ))}
                    </Space>
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
                      <Space wrap size="small" className="button-group">
                        {subjects.map(subject => (
                          <Button
                            key={subject.id}
                            type={selectedSubjectId === subject.id ? 'primary' : 'default'}
                            size="middle"
                            icon={getSubjectIcon(subject.name)}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className={`choice-btn ${selectedSubjectId === subject.id ? 'btn-selected' : ''}`}
                          >
                            {subject.name}
                          </Button>
                        ))}
                      </Space>
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
        /* Giữ nguyên class này */
        .curriculum-selection {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 100%
          );
          overflow: hidden; 
          min-height: 300px !important;
          padding: 40px 20px;
          position: relative;
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
          background-size: 100px 100px;
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
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .header-wrapper {
          text-align: center;
          margin-bottom: 48px;
          animation: slideUp 0.8s ease-out;
        }

        .primary-title {
          color: white !important;
          font-size: clamp(1.2rem, 4vw, 3rem) !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          margin-bottom: 16px !important;
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
          font-size: 18px !important;
          line-height: 1.6 !important;
          max-width: 600px !important;
          margin: 0 auto !important;
          animation: slideUp 0.8s ease-out 0.6s both;
        }

        .spinner-wrapper {
          text-align: center;
          padding: 80px 0;
          animation: fadeInScale 0.5s ease-out;
        }

        .spinner-container {
          margin-bottom: 24px;
        }

        .spinner-text {
          color: rgba(255, 255, 255, 0.85);
          font-size: 16px;
          font-weight: 500;
        }

        .alert-message {
          margin-bottom: 32px;
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
          animation: slideUp 0.5s ease-out;
        }

        .content-wrapper {
          position: relative;
          animation: slideUp 0.8s ease-out 0.8s both;
        }

        .step-card {
          border-radius: 20px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
          height: 380px !important;
          display: flex;
          flex-direction: column;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%);
          transition: background 0.3s ease;
        }

        .step-card.card-active {
          background: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 16px 48px rgba(96, 165, 250, 0.15) !important;
          border: 2px solid rgba(96, 165, 250, 0.2) !important;
          transform: translateY(-4px);
        }

        .step-card.card-active::before {
          background: linear-gradient(90deg, #60A5FA 0%, #F472B6 100%);
        }

        .step-card:hover {
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-2px);
        }

        .step-card.card-disabled {
          opacity: 0.5;
          pointer-events: none;
          filter: grayscale(0.3);
        }

        .card-inner {
          padding: 4px 16px !important;
          text-align: center;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          gap: 16px !important;
        }

        .number-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: #999;
          font-size: 18px;
          font-weight: 700;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .number-badge.badge-active {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(96, 165, 250, 0.4);
          transform: scale(1.05);
        }

        .card-title {
          margin: 0 !important;
          color: #666 !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          transition: color 0.3s ease !important;
          height: auto !important;
        }

        .card-title.title-active {
          color: #60A5FA !important;
        }

        .button-group {
          flex: 1;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          min-height: 140px !important;
          display: flex !important;
          align-items: flex-start !important;
          align-content: flex-start !important;
        }
        
        .choice-btn {
          border-radius: 12px !important;
          font-weight: 600 !important;
          min-width: 40px !important;
          height: 30px !important;
          font-size: 14px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: 2px solid #e8e8e8 !important;
          background: white !important;
          color: #666 !important;
        }

        .choice-btn:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
          border-color: #d0d0d0 !important;
        }
        
        .choice-btn.btn-selected {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%) !important;
          border-color: transparent !important;
          color: white !important;
          font-weight: 700 !important;
          box-shadow: 0 6px 20px rgba(96, 165, 250, 0.3) !important;
          transform: translateY(-2px) scale(1.05) !important;
        }

        .dropdown-select {
          width: 100% !important;
        }

        .dropdown-select .ant-select-selector {
          border-radius: 12px !important;
          border: 2px solid #e8e8e8 !important;
          height: 44px !important;
          padding: 8px 16px !important;
          transition: all 0.3s ease !important;
        }

        .dropdown-select:hover .ant-select-selector {
          border-color: #d0d0d0 !important;
        }

        .dropdown-select.ant-select-focused .ant-select-selector {
          border-color: #60A5FA !important;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1) !important;
        }

        .dropdown-item {
          padding: 4px 0;
        }

        .item-title {
          font-size: 14px;
          color: #444;
          font-weight: 500;
          line-height: 1.3;
        }

        .placeholder-state {
          flex: 1;
          padding: 20px 0;
          min-height: 70px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(249, 249, 249, 0.5);
          border-radius: 12px;
          border: 2px dashed #e0e0e0;
        }

        .placeholder-state .ant-typography {
          font-size: 14px !important;
          line-height: 1.5 !important;
          color: #999 !important;
          font-weight: 500 !important;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
          .step-card {
            height: 320px !important;
          }
          
          .button-group {
            min-height: 120px !important;
          }
          
          .placeholder-state {
            min-height: 120px !important;
          }
        }

        @media (max-width: 768px) {
          .curriculum-selection {
            padding: 24px 12px;
          }

          .header-wrapper {
            margin-bottom: 32px;
          }
          .description {
            font-size: 16px !important;
          }

          .step-card {
            margin-bottom: 20px;
            height: 280px !important;
          }
          .number-badge {
            width: 42px;
            height: 42px;
            font-size: 16px;
          }

          .card-title {
            font-size: 16px !important;
          }

          .choice-btn {
            height: 36px !important;
            font-size: 13px !important;
            min-width: 60px !important;
          }
          
          .button-group {
            min-height: 100px !important;
          }
          
          .placeholder-state {
            min-height: 100px !important;
            padding: 16px 0;
          }
        }

        @media (max-width: 480px) {
          .step-card {
            height: 260px !important;
          }

          .choice-btn {
            height: 32px !important;
            font-size: 12px !important;
            min-width: 55px !important;
            padding: 0 12px !important;
          }
          
          .button-group {
            min-height: 90px !important;
          }
          
          .placeholder-state {
            min-height: 90px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CurriculumSelection;