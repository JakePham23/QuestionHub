'use client';

import { useState, useEffect } from 'react';
import { Drawer, Button, Grid, Alert, Empty, Spin } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

import StudyCard from '@/components/questions/QuestionCard';
import AllQuestionsView from '../components/AllQuestionsView';
import StudyStats from '../components/StudyStats';
import QuestionNav from '@/components/questions/QuestionNav';
import ExerciseHeader from '../components/ExericseHeader';

import { StudyQuestion, AnswerCorrect, QuestionAttempt } from '@/types/exercise.type';
import { UserAnswers } from '@/types/common.type';
import { saveQuestionAttempt, getQuestionAttempts } from '@/services/exercise.service';

const { useBreakpoint } = Grid;

interface ExercisePageProps {
  topicId: number;
  initialQuestions: StudyQuestion[];
  initialAnswerCorrects: AnswerCorrect[];
}

export default function StudyExercisePage({
  topicId,
  initialQuestions,
  initialAnswerCorrects,
}: ExercisePageProps) {
  const [answerCorrects, setAnswerCorrects] = useState<AnswerCorrect[]>([]);
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

  // 🔹 Gửi toàn bộ attempt 1 lần
  const handleSubmitAll = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    if (!userId) {
      console.error('Không tìm thấy user_id trong localStorage');
      return;
    }

    try {
      const promises = questions.map(async (q) => {
        const ans = userAnswers[q.question_id];
        if (!ans) return; // bỏ qua câu chưa làm

        const isCorrect = answerCorrects.some(
          (a) => a.question_id === Number(q.question_id) && a.answer_correct == ans
        );

        await saveQuestionAttempt({
          user_id: userId,
          question_id: Number(q.question_id),
          selected_answer_id: typeof ans === 'number' ? ans : null,
          user_answer_text: typeof ans === 'string' ? ans : null,
          is_correct: isCorrect,
        });
      });

      await Promise.all(promises);
      console.log('✅ Gửi toàn bộ đáp án thành công');
    } catch (err) {
      console.error('❌ Lỗi khi gửi toàn bộ đáp án:', err);
    }
  };

  // 🔹 Load câu hỏi + attempts đã làm
useEffect(() => {
  (async () => {
    try {
      setAnswerCorrects(initialAnswerCorrects);
      setQuestions(initialQuestions);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.id) {
        const res = await getQuestionAttempts(topicId, user.id);
        const attempts: QuestionAttempt[] = res.metadata;

        // build lại userAnswers từ attempts
        const ua: UserAnswers = {};
        const answeredIdxs: number[] = [];

        attempts.forEach((a) => {
          ua[a.question_id] = a.selected_answer_id ?? a.user_answer_text;

          // tìm index của câu hỏi trong mảng
          const idx = initialQuestions.findIndex(
            q => Number(q.question_id) === a.question_id
          );
          if (idx !== -1) answeredIdxs.push(idx);
        });

        setUserAnswers(ua);
        setAnsweredQuestions(new Set(answeredIdxs)); // ✅ đánh dấu các câu đã làm rồi
      }
    } catch (err) {
      console.error('Lỗi tải attempts:', err);
    } finally {
      setLoading(false);
    }
  })();
}, [topicId, initialQuestions, initialAnswerCorrects]);

  // 🔹 Gọi khi chọn đáp án
  const handleAnswerSelect = async (ans: string | number) => {
    if (questions.length === 0) return;

    const currentQ = questions[currentQuestion];
    const qid = currentQ.question_id;

    setUserAnswers((prev) => ({ ...prev, [qid]: ans }));
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion]));

    const isCorrect = answerCorrects.some(
      (a) => a.question_id === Number(qid) && a.answer_correct == ans
    );

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.id;

      if (!userId) {
        console.error('Không tìm thấy user_id trong localStorage');
        return;
      }

      await saveQuestionAttempt({
        question_id: Number(qid),
        selected_answer_id: typeof ans === 'number' ? ans : null,
        user_answer_text: typeof ans === 'string' ? ans : null,
        is_correct: isCorrect,
        user_id: userId
      });
    } catch (err) {
      console.error('Lỗi lưu attempt:', err);
    }
  };

  const handleToggleAnswer = () => {
    if (questions.length === 0) return;
    const questionId = questions[currentQuestion].question_id;
    setShowAnswers((prev) => {
      const newSet = new Set(prev);
      newSet.has(questionId) ? newSet.delete(questionId) : newSet.add(questionId);
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

  const handleGoBack = () => window.history.back();
  const handleToggleView = () => {
    setShowAllQuestions((prev) => !prev);
    setIsDrawerVisible(false);
  };

  const answeredSet = new Set(
    Array.from(answeredQuestions).map((i) => questions[i]?.question_id ?? i)
  );

  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <ExerciseHeader
        handleGoBack={handleGoBack}
        handleReset={handleReset}
        handleSubmitAll={handleSubmitAll} // ✅ thêm nút Gửi
        isMobile={isMobile}
        setIsDrawerVisible={setIsDrawerVisible}
      />

      {/* Main */}
      <div style={{ display: 'flex', flex: 1, gap: 16 }}>
        {!isMobile ? (
          <PanelGroup direction="horizontal" style={{ height: '100%' }}>
            <Panel minSize={50} style={{ paddingRight: 16, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <Spin size="large" />
                  <p>Đang tải câu hỏi...</p>
                </div>
              ) : error ? (
                <Alert message="Lỗi" description={error} type="error" showIcon />
              ) : questions.length === 0 ? (
                <Empty description="Không có câu hỏi nào trong chuyên đề này." />
              ) : showAllQuestions ? (
                <AllQuestionsView
                  questions={questions}
                  userAnswers={userAnswers}
                  onAnswerSelect={(id, ans) =>
                    setUserAnswers((prev) => ({ ...prev, [id]: ans }))
                  }
                  onToggleAnswer={(id) =>
                    setShowAnswers((prev) => {
                      const newSet = new Set(prev);
                      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
                      return newSet;
                    })
                  }
                  showAnswers={showAnswers}
                  showAnswerCorrect={true}
                />
              ) : (
                <StudyCard
                  question={questions[currentQuestion]}
                  index={currentQuestion}
                  userAnswer={
                    userAnswers[questions[currentQuestion].question_id] as
                      | string
                      | number
                      | undefined
                  }
                  onAnswerChange={(_, ans) => handleAnswerSelect(ans)}
                  showAnswer={showAnswers.has(
                    questions[currentQuestion].question_id
                  )}
                  onToggleAnswer={handleToggleAnswer}
                  answer_corrects={answerCorrects}
                  showAnswerCorrect={true}
                />
              )}
            </Panel>

            <PanelResizeHandle
              style={{ width: '0px', background: '#e0e0e0', cursor: 'col-resize' }}
            />

            <Panel
              minSize={15}
              maxSize={30}
              defaultSize={22}
              style={{ overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <QuestionNav
                  questions={questions}
                  currentIndex={currentQuestion}
                  onSelect={setCurrentQuestion}
                  answeredSet={answeredSet}
                  showAll={showAllQuestions}
                  onToggleView={handleToggleView}
                  extraContent={
                    <StudyStats
                      questions={questions}
                      answeredQuestions={answeredQuestions}
                      showAnswers={showAnswers}
                    />
                  }
                />
              </div>
            </Panel>
          </PanelGroup>
        ) : (
         <>
    <Button
      type="primary"
      icon={<MenuOutlined />}
      onClick={() => setIsDrawerVisible(true)}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        borderRadius: '50%',
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />

    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Đang tải câu hỏi...</p>
        </div>
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      ) : questions.length === 0 ? (
        <Empty description="Không có câu hỏi nào trong chuyên đề này." />
      ) : showAllQuestions ? (
        <AllQuestionsView
          questions={questions}
          userAnswers={userAnswers}
          onAnswerSelect={(id, ans) =>
            setUserAnswers((prev) => ({ ...prev, [id]: ans }))
          }
          onToggleAnswer={(id) =>
            setShowAnswers((prev) => {
              const newSet = new Set(prev);
              newSet.has(id) ? newSet.delete(id) : newSet.add(id);
              return newSet;
            })
          }
          showAnswers={showAnswers}
          showAnswerCorrect={true}
        />
      ) : (
        <StudyCard
          question={questions[currentQuestion]}
          index={currentQuestion}
          userAnswer={
            userAnswers[questions[currentQuestion].question_id] as
              | string
              | number
              | undefined
          }
          onAnswerChange={(_, ans) => handleAnswerSelect(ans)}
          showAnswer={showAnswers.has(questions[currentQuestion].question_id)}
          onToggleAnswer={handleToggleAnswer}
          answer_corrects={answerCorrects}
          showAnswerCorrect={true}
        />
      )}
    </div>

    <Drawer
      title="Danh sách câu hỏi"
      placement="right"
      onClose={() => setIsDrawerVisible(false)}
      open={isDrawerVisible}
      width="280px"
    >
      <QuestionNav
        questions={questions}
        currentIndex={currentQuestion}
        onSelect={(index) => {
          setCurrentQuestion(index);
          setIsDrawerVisible(false);
        }}
        answeredSet={answeredSet}
        extraContent={
          <StudyStats
            questions={questions}
            answeredQuestions={answeredQuestions}
            showAnswers={showAnswers}
          />
        }
      />
    </Drawer>
  </>
)}
      </div>
    </div>
  );
}
