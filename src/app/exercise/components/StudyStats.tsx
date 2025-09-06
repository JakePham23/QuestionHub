import React from 'react';
import { StudyStatsProps } from '@/types/exercise.type';

const StudyStats: React.FC<StudyStatsProps> = ({
  questions,
  answeredQuestions,
  showAnswers,
}) => (
  <div
    style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      background: '#fff',
    }}
  >
    <h4 style={{ marginBottom: 12 }}>Thống kê học tập</h4>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        textAlign: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{questions.length}</div>
        <div>Tổng câu</div>
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          {answeredQuestions.size}
        </div>
        <div>Đã làm</div>
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{showAnswers.size}</div>
        <div>Đã xem đáp án</div>
      </div>
    </div>
  </div>
);

export default StudyStats;