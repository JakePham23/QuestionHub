'use client'
import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { StudyStatsProps } from '@/types/exercise.type';

const { Title } = Typography;

const StudyStats: React.FC<StudyStatsProps> = ({
  questions,
  answeredQuestions,
  showAnswers,
}) => {
  return (
    <Card
      size="small"
      style={{
        borderRadius: 8,
        background: '#fff'
      }}
    >
      <Title level={5} style={{ marginBottom: 12, textAlign: 'center' }}>
        📊 Thống kê học tập
      </Title>

      <Row gutter={16} justify="space-around" align="middle">
        <Col xs={8}>
          <Statistic
            title="Tổng câu"
            value={questions.length}
            valueStyle={{ fontSize: 20, fontWeight: 600 }}
          />
        </Col>
        <Col xs={8}>
          <Statistic
            title="Đã làm"
            value={answeredQuestions.size}
            valueStyle={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}
          />
        </Col>
        <Col xs={8}>
          <Statistic
            title="Đã xem đáp án"
            value={showAnswers.size}
            valueStyle={{ fontSize: 20, fontWeight: 600, color: '#faad14' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default StudyStats;
