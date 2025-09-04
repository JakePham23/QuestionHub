'use client';

import React, { useState } from 'react';
import {
  Book,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Lightbulb,
  RotateCcw,
  List,
  ArrowLeft,
} from 'lucide-react';

import {
  Drawer,
  Button,
  Grid,
  Typography,
} from 'antd';
import {
  MenuOutlined,
} from '@ant-design/icons';


const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// ================== Types ==================
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  topic: string;
  hasImage?: boolean;
}

interface StudyModeCardProps {
  question: Question;
  index: number;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  userAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
}

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  onQuestionSelect: (index: number) => void;
  answeredQuestions: Set<number>;
  onToggleView: () => void; // Thay đổi từ onShowAll
  showAllQuestions: boolean; // Thêm prop mới
}

interface StudyStatsProps {
  questions: Question[];
  answeredQuestions: Set<number>;
  showAnswers: Set<number>;
}

interface AllQuestionsViewProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
  onToggleAnswer: (questionId: number) => void;
  showAnswers: Set<number>;
}

// ================== Mock data ==================
const mockQuestions: Question[] = [
  {
    id: 1,
    question: 'Phương trình 2 sin x - √3 = 0 có tập nghiệm là:',
    options: [
      '{±π/6 + k2π, k ∈ ℤ}',
      '{±π/3 + k2π, k ∈ ℤ}',
      '{π/6 + k2π, 5π/6 + k2π, k ∈ ℤ}',
      '{π/3 + k2π, 2π/3 + k2π, k ∈ ℤ}',
    ],
    correctAnswer: 2,
    explanation:
      'Từ phương trình 2 sin x - √3 = 0, ta có sin x = √3/2. Trong khoảng [0, 2π], sin x = π/3 hoặc x = 2π/3.',
    hint: 'Nhớ rằng sin x = √3/2 tại các góc đặc biệt π/3 và 2π/3',
    difficulty: 'Dễ',
    topic: 'Phương trình lượng giác cơ bản',
  },
  {
    id: 2,
    question: 'Đồ thị nào dưới đây là đồ thị của hàm số y = sin x:',
    options: [
      'Đồ thị A - Hàm sine chuẩn',
      'Đồ thị B - Hàm cosine',
      'Đồ thị C - Hàm tangent',
      'Đồ thị D - Hàm cotangent',
    ],
    correctAnswer: 0,
    hasImage: true,
    explanation:
      'Đồ thị hàm số y = sin x có dạng sóng với chu kì 2π, đi qua gốc tọa độ O(0,0), và có giá trị trong khoảng [-1, 1].',
    hint: 'Hàm sin bắt đầu từ điểm (0,0) và tăng trong góc phần tư thứ nhất',
    difficulty: 'Dễ',
    topic: 'Đồ thị hàm lượng giác',
  },
];

// ================== Components ==================
const StudyModeCard: React.FC<StudyModeCardProps> = ({
  question,
  index,
  showAnswer,
  onToggleAnswer,
  userAnswer,
  onAnswerSelect,
}) => {
  const [showHint, setShowHint] = useState(false);

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'Dễ':
        return '#52c41a';
      case 'Trung bình':
        return '#faad14';
      case 'Khó':
        return '#f5222d';
      default:
        return '#1890ff';
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        background: '#fff',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Book size={20} />
          <span>Câu {index + 1}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              color: '#fff',
              background: getDifficultyColor(question.difficulty),
            }}
          >
            {question.difficulty}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              background: '#f0f0f0',
            }}
          >
            {question.topic}
          </span>
        </div>
      </div>

      {/* Question */}
      <h3 style={{ marginBottom: 12 }}>{question.question}</h3>

      {question.hasImage && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img
            src="/api/placeholder/500/300"
            alt="Biểu đồ"
            style={{ maxWidth: '100%', borderRadius: 6 }}
          />
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'grid', gap: 8 }}>
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctAnswer;
          const isSelected = userAnswer === optionIndex;
          const isWrong = showAnswer && isSelected && userAnswer !== question.correctAnswer;

          // Xác định màu sắc và viền dựa trên trạng thái
          const backgroundColor = isSelected && !showAnswer ? '#e6f7ff' : 
                                 isCorrect && showAnswer ? '#e6fffb' : 
                                 isWrong ? '#fff2f0' : '#fff';
          const borderColor = isSelected && !showAnswer ? '#1890ff' :
                              isCorrect && showAnswer ? '#52c41a' :
                              isWrong ? '#ff4d4f' : '#ddd';

          return (
            <div
              key={optionIndex}
              onClick={() => !showAnswer && onAnswerSelect(optionIndex)}
              style={{
                padding: 12,
                border: `1px solid ${borderColor}`,
                borderRadius: 6,
                cursor: showAnswer ? 'default' : 'pointer',
                background: backgroundColor,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {showAnswer && isCorrect && (
                <CheckCircle size={20} color="#52c41a" />
              )}
              {isWrong && <XCircle size={20} color="#f5222d" />}
              <span>{option}</span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setShowHint(!showHint)}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Lightbulb size={16} />
          {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
        </button>
        <button
          onClick={onToggleAnswer}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
          {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
        </button>
      </div>

      {showHint && (
        <div style={{ marginTop: 12, padding: 12, background: '#fffbe6' }}>
          {question.hint}
        </div>
      )}

      {showAnswer && (
        <div style={{ marginTop: 12, padding: 12, background: '#f6ffed' }}>
          <strong>Đáp án đúng:</strong> {question.options[question.correctAnswer]}
          <div style={{ marginTop: 8 }}>{question.explanation}</div>
        </div>
      )}
    </div>
  );
};
const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  onQuestionSelect,
  answeredQuestions,
  onToggleView,
  showAllQuestions,
}) => (
  <div
    style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      background: '#fff',
    }}
  >
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
      <h4 style={{ margin: 0 }}>Danh sách câu hỏi</h4>
      <button
        onClick={onToggleView}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          border: '1px solid #ddd',
          borderRadius: 6,
          background: '#fff',
          cursor: 'pointer',
          fontSize: 12
        }}
      >
        {showAllQuestions ? <Eye size={16} /> : <List size={16} />}
        {showAllQuestions ? 'Xem từng câu' : 'Xem tất cả'}
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
      {questions.map((_, index) => {
        const isCurrent = index === currentIndex;
        const isAnswered = answeredQuestions.has(index);
        return (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            style={{
              padding: '8px 0',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: isCurrent
                ? '#1890ff'
                : isAnswered
                ? '#52c41a'
                : '#fafafa',
              color: isCurrent || isAnswered ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  </div>
);

const AllQuestionsView: React.FC<AllQuestionsViewProps> = ({
  questions,
  userAnswers,
  onAnswerSelect,
  onToggleAnswer,
  showAnswers
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {questions.map((question, index) => (
      <StudyModeCard
        key={question.id}
        question={question}
        index={index}
        userAnswer={userAnswers[question.id]}
        onAnswerSelect={(answerIndex) => onAnswerSelect(question.id, answerIndex)}
        showAnswer={showAnswers.has(question.id)}
        onToggleAnswer={() => onToggleAnswer(question.id)}
      />
    ))}
  </div>
);

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

// ================== Main Page ==================
export default function StudyExercisePage() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState<Set<number>>(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const handleAnswerSelect = (answerIndex: number) => {
    const questionId = mockQuestions[currentQuestion].id;
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion]));
  };

  const handleAllViewAnswerSelect = (questionId: number, answerIndex: number) => {
    const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    setAnsweredQuestions((prev) => new Set([...prev, questionIndex]));
  };

  const handleToggleAnswer = () => {
    setShowAnswers((prev) => {
      const newSet = new Set(prev);
      const currentQuestionId = mockQuestions[currentQuestion].id;
      if (newSet.has(currentQuestionId)) {
        newSet.delete(currentQuestionId);
      } else {
        newSet.add(currentQuestionId);
      }
      return newSet;
    });
  };

  const handleAllViewToggleAnswer = (questionId: number) => {
    setShowAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowAnswers(new Set());
    setAnsweredQuestions(new Set());
    setCurrentQuestion(0);
    setShowAllQuestions(false);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleToggleView = () => {
    setShowAllQuestions((prev) => !prev);
    setIsDrawerVisible(false); // Đóng drawer sau khi chuyển chế độ
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa',
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleGoBack}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <ArrowLeft size={20} />
            <span style={{fontSize: 14}}>Quay lại</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
            <Book size={24} />
            <Title level={4} style={{ margin: 0 }}>Luyện tập</Title>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsDrawerVisible(true)}
            />
          )}
          <Button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <RotateCcw size={16} />
            Làm lại
          </Button>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Main Content Area */}
        <div style={{ flex: 2 }}>
          {showAllQuestions ? (
            <AllQuestionsView
              questions={mockQuestions}
              userAnswers={userAnswers}
              onAnswerSelect={handleAllViewAnswerSelect}
              onToggleAnswer={handleAllViewToggleAnswer}
              showAnswers={showAnswers}
            />
          ) : (
            <StudyModeCard
              question={mockQuestions[currentQuestion]}
              index={currentQuestion}
              showAnswer={showAnswers.has(mockQuestions[currentQuestion].id)}
              onToggleAnswer={handleToggleAnswer}
              userAnswer={userAnswers[mockQuestions[currentQuestion].id]}
              onAnswerSelect={handleAnswerSelect}
            />
          )}
        </div>
        
        {/* Sidebar (phải) - chỉ hiển thị trên desktop */}
        {!isMobile && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <QuestionNavigator
              questions={mockQuestions}
              currentIndex={currentQuestion}
              onQuestionSelect={setCurrentQuestion}
              answeredQuestions={answeredQuestions}
              onToggleView={handleToggleView}
              showAllQuestions={showAllQuestions}
            />
            <StudyStats
              questions={mockQuestions}
              answeredQuestions={answeredQuestions}
              showAnswers={showAnswers}
            />
          </div>
        )}
      </div>

      {/* Drawer chỉ hiển thị trên mobile */}
      {isMobile && (
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
        >
          <QuestionNavigator
            questions={mockQuestions}
            currentIndex={currentQuestion}
            onQuestionSelect={(index) => {
              setCurrentQuestion(index);
              setIsDrawerVisible(false); // Đóng drawer sau khi chọn
            }}
            answeredQuestions={answeredQuestions}
            onToggleView={handleToggleView}
            showAllQuestions={showAllQuestions}
          />
          <StudyStats
            questions={mockQuestions}
            answeredQuestions={answeredQuestions}
            showAnswers={showAnswers}
          />
        </Drawer>
      )}
    </div>
  );
}