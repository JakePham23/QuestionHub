// src/components/HeroSection.tsx
import { Typography } from 'antd';
import { BookOutlined, TrophyOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  return (
    <div className="hero-section">
      {/* Background overlay */}
      <div className="hero-background" />
      
      {/* Floating elements for visual interest */}
      <div className="floating-elements">
        <div className="floating-icon floating-icon-1">
          <BookOutlined />
        </div>
        <div className="floating-icon floating-icon-2">
          <TrophyOutlined />
        </div>
        <div className="floating-icon floating-icon-3">
          <BookOutlined />
        </div>
      </div>

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-badge">
          🎯 Hệ thống luyện thi hàng đầu
        </div>
        
        <Title 
          level={1} 
          className="hero-title"
        >
          Làm chủ kiến thức,
          <br />
          <span className="gradient-text">tự tin vào phòng thi</span>
        </Title>
        
        <Paragraph className="hero-description">
          Ngân hàng đề thi trắc nghiệm Toán - Vật Lý - Hóa khổng lồ, 
          bám sát chương trình học cho mọi cấp lớp với công nghệ AI tiên tiến.
        </Paragraph>

        <div className="hero-stats">
          <div className="stat-item">
            <strong>10,000+</strong>
            <span>Câu hỏi</span>
          </div>
          <div className="stat-item">
            <strong>100, 000, 000+</strong>
            <span>Học sinh</span>
          </div>
          <div className="stat-item">
            <strong>95%</strong>
            <span>Đỗ đại học</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 40vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 24px;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(45, 55, 72, 0.95) 0%,
            rgba(68, 90, 120, 0.9) 50%,
            rgba(45, 55, 72, 0.95) 100%
          ),
          url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80') 
          no-repeat center center;
          background-size: cover;
          z-index: -2;
        }

        .hero-background::before {
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
          z-index: 1;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: -1;
        }

        .floating-icon {
          position: absolute;
          color: rgba(255, 255, 255, 0.1);
          font-size: 64px;
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon-2 {
          top: 30%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-icon-3 {
          bottom: 25%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60A5FA;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          animation: slideInUp 0.8s ease-out;
        }

        .hero-title {
          color: white !important;
          font-size: clamp(2.5rem, 5vw, 4rem) !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
          margin-bottom: 24px !important;
          animation: slideInUp 0.8s ease-out 0.2s both;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          color: #E2E8F0 !important;
          font-size: 20px !important;
          line-height: 1.6 !important;
          max-width: 700px !important;
          margin: 0 auto 40px !important;
          animation: slideInUp 0.8s ease-out 0.4s both;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 48px;
          animation: slideInUp 0.8s ease-out 0.6s both;
        }

        .stat-item {
          text-align: center;
          color: white;
        }

        .stat-item strong {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #60A5FA;
          margin-bottom: 4px;
        }

        .stat-item span {
          font-size: 14px;
          color: #CBD5E0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: slideInUp 0.8s ease-out 0.8s both;
        }

        .primary-button {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 12px 32px !important;
          height: auto !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3) !important;
          transition: all 0.3s ease !important;
        }

        .primary-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4) !important;
        }

        .secondary-button {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          border-radius: 12px !important;
          padding: 12px 32px !important;
          height: auto !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }

        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          transform: translateY(-1px) !important;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 16px;
            min-height: 90vh;
          }

          .hero-stats {
            gap: 24px;
            margin-bottom: 32px;
          }

          .stat-item strong {
            font-size: 24px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
            max-width: 280px;
          }

          .floating-icon {
            font-size: 48px;
          }
        }

        @media (max-width: 480px) {
          .hero-badge {
            font-size: 12px;
            padding: 6px 16px;
          }

          .hero-description {
            font-size: 18px !important;
          }

          .hero-stats {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;