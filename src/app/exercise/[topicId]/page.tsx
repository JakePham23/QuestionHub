'use client';

import React, { useState, useEffect } from 'react';
import { Book, RotateCcw, ArrowLeft } from 'lucide-react';
import { Drawer, Button, Grid, Typography, Alert, Empty } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { StudyQuestion, UserAnswers } from '@/types/exercise.type';
import { getExerciseData } from '@/services/exercise.service';
import StudyModeCard from '../components/StudyModeCard';
import QuestionNavigator from '../components/QuestionNavigator';
import AllQuestionsView from '../components/AllQuestionsView';
import StudyStats from '../components/StudyStats';

const { Title } = Typography;
const { useBreakpoint } = Grid;

type Params = { topicId: string };

export default function StudyExercisePage({ params }: { params: Params }) {
  const { topicId } = params;

  const [questions, setQuestions] = useState<StudyQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showAnswers, setShowAnswers] = useState<Set<string>>(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { questions: fetchedQuestions } = await getExerciseData(topicId);
        
        const transformedQuestions: StudyQuestion[] = fetchedQuestions.map((q) => {
          const correctOptionIndex = q.answer_choices?.findIndex(choice => choice.is_correct) ?? -1;
          const options = q.answer_choices?.map(choice => choice.choice_text) ?? [];

          return {
            ...q,
            question_id: q.question_id.toString(),
            id: Number(q.question_id),
            question: q.question_text,
            options: options,
            correctAnswer: correctOptionIndex,
            explanation: `Lời giải cho câu hỏi này. (Chưa có dữ liệu)`,
            hint: `Gợi ý cho câu hỏi này. (Chưa có dữ liệu)`,
            difficulty: 'Dễ',
            topic: 'Toán 11',
          };
        });

        setQuestions(transformedQuestions);
      } catch (err) {
        setError("Không thể tải dữ liệu bài tập. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topicId]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (questions.length > 0) {
      const questionId = questions[currentQuestion].question_id;
      setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
      setAnsweredQuestions((prev) => new Set([...prev, currentQuestion]));
    }
  };

  const handleAllViewAnswerSelect = (questionId: string, answerIndex: number) => {
    const questionIndex = questions.findIndex(q => q.question_id === questionId);
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    if (questionIndex !== -1) {
      setAnsweredQuestions((prev) => new Set([...prev, questionIndex]));
    }
  };

  const handleToggleAnswer = () => {
    if (questions.length > 0) {
      setShowAnswers((prev) => {
        const newSet = new Set(prev);
        const currentQuestionId = questions[currentQuestion].question_id;
        if (newSet.has(currentQuestionId)) {
          newSet.delete(currentQuestionId);
        } else {
          newSet.add(currentQuestionId);
        }
        return newSet;
      });
    }
  };

  const handleAllViewToggleAnswer = (questionId: string) => {
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
    setIsDrawerVisible(false);
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
            <span style={{ fontSize: 14 }}>Quay lại</span>
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>Đang tải câu hỏi...</p>
            </div>
          ) : error ? (
            <Alert message="Lỗi" description={error} type="error" showIcon />
          ) : questions.length === 0 ? (
            <Empty description="Không có câu hỏi nào trong chuyên đề này." />
          ) : (
            showAllQuestions ? (
              <AllQuestionsView
                questions={questions}
                userAnswers={userAnswers}
                onAnswerSelect={handleAllViewAnswerSelect}
                onToggleAnswer={handleAllViewToggleAnswer}
                showAnswers={showAnswers}
              />
            ) : (
              <StudyModeCard
                question={questions[currentQuestion]}
                index={currentQuestion}
                showAnswer={showAnswers.has(questions[currentQuestion].question_id)}
                onToggleAnswer={handleToggleAnswer}
                userAnswer={userAnswers[questions[currentQuestion].question_id] as number | undefined}
                onAnswerSelect={handleAnswerSelect}
              />
            )
          )}
        </div>
        
        {/* Sidebar (phải) - chỉ hiển thị trên desktop */}
        {!isMobile && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <QuestionNavigator
              questions={questions}
              currentIndex={currentQuestion}
              onQuestionSelect={setCurrentQuestion}
              answeredQuestions={answeredQuestions}
              onToggleView={handleToggleView}
              showAllQuestions={showAllQuestions}
            />
            <StudyStats
              questions={questions}
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
            questions={questions}
            currentIndex={currentQuestion}
            onQuestionSelect={(index) => {
              setCurrentQuestion(index);
              setIsDrawerVisible(false);
            }}
            answeredQuestions={answeredQuestions}
            onToggleView={handleToggleView}
            showAllQuestions={showAllQuestions}
          />
          <StudyStats
            questions={questions}
            answeredQuestions={answeredQuestions}
            showAnswers={showAnswers}
          />
        </Drawer>
      )}
    </div>
  );
}