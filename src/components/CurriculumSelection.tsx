// src/components/CurriculumSelection.tsx
import { Typography, Row, Col, Select, Space, Spin, Alert, Button, Card } from 'antd';
import { BookOutlined, CodeOutlined, ExperimentOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

// Định nghĩa các kiểu dữ liệu
interface Grade {
  id: string | number;
  name: string;
}

interface Subject {
  id: string | number;
  name: string;
}

interface Chapter {
  chapter_id: string | number;
  chapter_name: string;
}

interface CurriculumSelectionProps {
  loading: boolean;
  error: string | null;
  grades: Grade[];
  subjects: Subject[];
  chapters: Chapter[];
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
      <div className="background-pattern" />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header Section */}
        <div className="header-section">
          
          <Title level={1} className="main-title">
            Khám phá hành trình
            <span className="gradient-text"> học tập của bạn</span>
          </Title>
          
          <Text className="subtitle">
            Tùy chỉnh trải nghiệm học tập theo cấp độ và sở thích cá nhân
          </Text>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">
              <Spin size="large" />
            </div>
            <div className="loading-text">Đang tải dữ liệu...</div>
          </div>
        )}
        
        {error && (
          <Alert 
            message="Có lỗi xảy ra" 
            description={error} 
            type="error" 
            showIcon 
            className="error-alert"
          />
        )}

        {!loading && !error && (
          <div className="selection-container">

            <Row gutter={[24, 24]} justify="center" align="top">
              {/* 1. Chọn Lớp học */}
              <Col xs={24} md={7}>
                <Card className={`selection-card ${selectedGradeId ? 'active' : ''}`}>
                  {selectedGradeId && <div className="card-highlight" />}
                  
                  <div className="card-content">
                    <div className={`step-number ${selectedGradeId ? 'active' : ''}`}>
                      1
                    </div>
                    
                    <Title level={5} className={`step-title ${selectedGradeId ? 'active' : ''}`}>
                      Chọn Lớp học
                    </Title>
                    
                    <Space wrap size="small" className="options-container">
                      {grades.map(grade => (
                        <Button
                          key={grade.id}
                          type={selectedGradeId === grade.id ? 'primary' : 'default'}
                          size="middle"
                          onClick={() => handleGradeSelect(grade.id)}
                          className={`option-button ${selectedGradeId === grade.id ? 'selected' : ''}`}
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
                <Card className={`selection-card ${selectedSubjectId ? 'active' : ''} ${!selectedGradeId ? 'disabled' : ''}`}>
                  {selectedSubjectId && <div className="card-highlight" />}
                  
                  <div className="card-content">
                    <div className={`step-number ${selectedSubjectId ? 'active' : ''}`}>
                      2
                    </div>
                    
                    <Title level={5} className={`step-title ${selectedSubjectId ? 'active' : ''}`}>
                      Chọn Môn học
                    </Title>
                    
                    {subjects.length > 0 ? (
                      <Space wrap size="small" className="options-container">
                        {subjects.map(subject => (
                          <Button
                            key={subject.id}
                            type={selectedSubjectId === subject.id ? 'primary' : 'default'}
                            size="middle"
                            icon={getSubjectIcon(subject.name)}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className={`option-button ${selectedSubjectId === subject.id ? 'selected' : ''}`}
                          >
                            {subject.name}
                          </Button>
                        ))}
                      </Space>
                    ) : (
                      <div className="empty-state">
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
                <Card className={`selection-card ${selectedChapterId ? 'active' : ''} ${!selectedSubjectId ? 'disabled' : ''}`}>
                  {selectedChapterId && <div className="card-highlight" />}
                  
                  <div className="card-content">
                    <div className={`step-number ${selectedChapterId ? 'active' : ''}`}>
                      3
                    </div>
                    
                    <Title level={5} className={`step-title ${selectedChapterId ? 'active' : ''}`}>
                      Chọn Chương
                    </Title>
                    
                    <Select
                      className="chapter-select"
                      size="middle"
                      placeholder="Chọn chương học"
                      value={selectedChapterId}
                      onChange={(value) => setSelectedChapterId(value)}
                      disabled={!selectedGradeId || !selectedSubjectId || chapters.length === 0}
                    >
                      {chapters.map(chapter => (
                        <Option key={chapter.chapter_id} value={chapter.chapter_id}>
                          <div className="chapter-option">
                            <div className="chapter-name">
                              {chapter.chapter_name}
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                    
                    {!selectedGradeId || !selectedSubjectId ? (
                      <div className="empty-state">
                        <Text type="secondary">
                          Hoàn thành các bước trước
                        </Text>
                      </div>
                    ) : chapters.length === 0 ? (
                      <div className="empty-state">
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
          position: relative;
          height: 450px;
          padding: 40px 24px;
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 100%
          );
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .background-pattern {
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

        .background-pattern::before {
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

        .header-section {
          text-align: center;
          margin-bottom: 48px;
          animation: slideInUp 0.8s ease-out;
        }

        .header-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
          animation: slideInUp 0.8s ease-out 0.2s both;
        }

        .main-title {
          color: white !important;
          font-size: clamp(1.5rem, 3vw, 2.5rem) !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
          margin-bottom: 12px !important;
          animation: slideInUp 0.8s ease-out 0.4s both;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
          max-width: 500px !important;
          margin: 0 auto !important;
          animation: slideInUp 0.8s ease-out 0.6s both;
        }

        .loading-container {
          text-align: center;
          padding: 60px 0;
          animation: fadeIn 0.5s ease-out;
        }

        .loading-spinner {
          margin-bottom: 20px;
        }

        .loading-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .error-alert {
          margin-bottom: 24px;
          border-radius: 12px !important;
          animation: slideInUp 0.5s ease-out;
        }

        .selection-container {
          position: relative;
          animation: slideInUp 0.8s ease-out 0.8s both;
        }

        .selection-card {
          border-radius: 16px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
          height: 240px !important;
          min-height: 240px !important;
          max-height: 240px !important;
        }

        .selection-card.active {
          background: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 12px 36px rgba(96, 165, 250, 0.2) !important;
          border: 2px solid rgba(96, 165, 250, 0.3) !important;
          transform: translateY(-2px);
        }

        .selection-card.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .card-highlight {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #60A5FA 0%, #F472B6 100%);
        }

        .card-content {
          padding: 20px 16px !important;
          text-align: center;
          height: 240px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          box-sizing: border-box !important;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: #999;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .step-number.active {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%);
          color: white;
          box-shadow: 0 3px 15px rgba(96, 165, 250, 0.3);
        }

        .step-title {
          margin: 12px 0 20px 0 !important;
          color: #888 !important;
          font-size: 16px !important;
          transition: color 0.3s ease !important;
          height: 24px !important;
        }

        .step-title.active {
          color: #60A5FA !important;
        }

        .options-container {
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          min-height: 80px !important;
          display: flex !important;
          align-items: flex-start !important;
          align-content: flex-start !important;
        }

        .option-button {
          border-radius: 8px !important;
          font-weight: 500 !important;
          min-width: 60px !important;
          height: 32px !important;
          font-size: 12px !important;
          transition: all 0.3s ease !important;
          border: 1px solid #e0e0e0 !important;
          padding: 0 12px !important;
        }

        .option-button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .option-button.selected {
          background: linear-gradient(135deg, #60A5FA 0%, #F472B6 100%) !important;
          border-color: transparent !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 12px rgba(96, 165, 250, 0.3) !important;
        }

        .chapter-select {
          width: 100% !important;
          height: 36px !important;
        }

        .chapter-select .ant-select-selector {
          border-radius: 8px !important;
          border: 1px solid #e0e0e0 !important;
          height: 36px !important;
        }

        .chapter-select.ant-select-focused .ant-select-selector {
          border-color: #60A5FA !important;
          box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.1) !important;
        }

        .chapter-option {
          padding: 2px 0;
        }

        .chapter-name {
          font-size: 14px;
          color: #666;
          margin-top: 1px;
          line-height: 1.2;
        }

        .empty-state {
          padding: 16px 0;
          min-height: 80px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .empty-state .ant-typography {
          font-size: 12px !important;
          line-height: 1.4 !important;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .curriculum-selection {
            height: auto;
            min-height: 100vh;
            padding: 32px 16px;
          }
          
          .selection-card {
            height: 220px !important;
            min-height: 220px !important;
            max-height: 220px !important;
          }
        }

        @media (max-width: 768px) {
          .curriculum-selection {
            padding: 24px 12px;
            height: auto;
            min-height: 100vh;
          }

          .header-section {
            margin-bottom: 32px;
          }

          .main-title {
            font-size: 1.5rem !important;
          }

          .subtitle {
            font-size: 14px !important;
          }


          .selection-card {
            margin-bottom: 16px;
            height: 200px !important;
            min-height: 200px !important;
            max-height: 200px !important;
          }

          .card-content {
            padding: 16px 12px !important;
            min-height: 200px !important;
            max-height: 200px !important;
          }

          .step-number {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }

          .step-title {
            font-size: 14px !important;
            margin: 10px 0 12px 0 !important;
          }

          .option-button {
            height: 28px !important;
            font-size: 11px !important;
            min-width: 50px !important;
          }
        }

        @media (min-width: 1400px) {
          .curriculum-selection {
            height: 100vh;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CurriculumSelection;