// src/components/CurriculumSelection.tsx

import { Typography, Row, Col, Select, Space, Spin, Alert, Button, Card } from 'antd';
import { BookOutlined, CodeOutlined, ExperimentOutlined } from '@ant-design/icons';
import React from 'react';

// Import types from the centralized file
import { GradeItem, SubjectItem, ChapterItem } from '@/types/data.type';

const { Title, Text } = Typography;
const { Option } = Select;

// Remove local type definitions to avoid duplication
/*
interface Grade { ... }
interface Subject { ... }
interface Chapter { ... }
*/

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

// Function to get subject icon remains the same
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
      {/* ... (rest of the component's JSX remains the same) ... */}
    </div>
  );
};

export default CurriculumSelection;