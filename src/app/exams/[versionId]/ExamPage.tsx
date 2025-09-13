'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Layout, Alert, Modal, Card, Button, Drawer, Spin } from 'antd';
import QuestionList from '../../../components/questions/QuestionList';
import ExamHeader from '../components/ExamHeader';
import QuestionNav from '../../../components/questions/QuestionNav';
import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { useNotify } from '@/providers/NotificationProvider';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Content } from 'antd/es/layout/layout';
import {
  Question,
  ExamDetail,
  UserAnswers,
  ExamStatus,
  SavedExamData,
} from '@/types/exam.type';

const STORAGE_KEY = 'exam_data_';
const AUTO_SAVE_INTERVAL = 10000;

interface ExamPageProps {
  versionId: string;
  examDetail: ExamDetail;
  initialQuestions: Question[];
  initialError: string | null;
}

export default function ExamPage({
  versionId,
  examDetail,
  initialQuestions,
  initialError,
}: ExamPageProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [error, setError] = useState<string | null>(initialError);
  const [timeLeft, setTimeLeft] = useState<number>(examDetail.duration_minutes * 60);
  const [examStatus, setExamStatus] = useState<ExamStatus>('not-started');
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [isRecovering, setIsRecovering] = useState<boolean>(true);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_KEY}${versionId}`;
  const { notification, modal } = useNotify();

  const handleToggleView = () => {
    setShowAllQuestions(prev => !prev);
    if (isMobile) setDrawerVisible(false);
  };

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ===== LocalStorage helpers =====
  const loadFromStorage = useCallback((): SavedExamData | null => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) return JSON.parse(savedData) as SavedExamData;
    } catch (error) {
      console.error('Failed to load exam data:', error);
    }
    return null;
  }, [storageKey]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const saveToStorage = useCallback(
    (data: Partial<SavedExamData>) => {
      try {
        const examData: SavedExamData = {
          userAnswers: data.userAnswers || userAnswers,
          timeLeft: data.timeLeft ?? timeLeft,
          examStatus: (data.examStatus as ExamStatus) || examStatus,
          examStartTime: data.examStartTime ?? examStartTime,
          currentQuestionIndex: data.currentQuestionIndex ?? currentQuestionIndex,
          lastSaved: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(examData));
      } catch (error) {
        console.error('Failed to save exam data:', error);
      }
    },
    [storageKey, userAnswers, timeLeft, examStatus, examStartTime, currentQuestionIndex]
  );

  // ===== Init load & recover =====
  useEffect(() => {
    if (initialError) {
      setError(initialError);
      setLoading(false);
      return;
    }
    setQuestions(initialQuestions);
    setLoading(false);

    const savedData = loadFromStorage();
    if (savedData && savedData.examStatus !== 'submitted') {
      modal.confirm({
        title: '🔄 Khôi phục bài làm',
        content: (
          <div>
            <p>Hệ thống phát hiện bài làm chưa hoàn thành từ lần trước:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Đã trả lời: <strong>{Object.keys(savedData.userAnswers || {}).length}</strong> câu</li>
              <li>Thời gian còn lại: <strong>{Math.floor(savedData.timeLeft / 60)} phút {savedData.timeLeft % 60} giây</strong></li>
              <li>Lần lưu cuối: <strong>{new Date(savedData.lastSaved).toLocaleTimeString()}</strong></li>
            </ul>
            <p>Bạn có muốn tiếp tục bài làm này không?</p>
          </div>
        ),
        okText: '✅ Tiếp tục làm bài',
        cancelText: '🆕 Làm bài mới',
        onOk: () => {
          setUserAnswers(savedData.userAnswers || {});
          setTimeLeft(savedData.timeLeft);
          setExamStatus(savedData.examStatus || 'not-started');
          setExamStartTime(savedData.examStartTime ?? null);
          setCurrentQuestionIndex(savedData.currentQuestionIndex ?? 0);
          setIsRecovering(false);
          notification.success({
            message: 'Khôi phục thành công!',
            description: 'Bài làm của bạn đã được khôi phục từ lần truy cập trước.',
          });
        },
        onCancel: () => {
          clearStorage();
          setIsRecovering(false);
          notification.info({
            message: 'Bắt đầu bài mới',
            description: 'Dữ liệu cũ đã được xóa, bạn sẽ làm bài từ đầu.',
          });
        },
      });
    } else {
      setIsRecovering(false);
    }
  }, [initialQuestions, initialError, versionId, modal, notification, loadFromStorage, clearStorage]);

  // ===== Auto save to server =====
  const saveToServer = useCallback(
    async (answers: UserAnswers) => {
      if (!answers || Object.keys(answers).length === 0) return;
      try {
        await fetch(`/api/exam/${versionId}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, timeLeft, examStatus }),
        });
      } catch (error) {
        console.error('Server save error:', error);
        // fallback local
        saveToStorage({ userAnswers: answers });
      }
    },
    [versionId, timeLeft, examStatus, saveToStorage]
  );

  useEffect(() => {
    if (examStatus === 'in-progress' && !isRecovering) {
      autoSaveIntervalRef.current = setInterval(() => {
        saveToStorage({});
        saveToServer(userAnswers);
      }, AUTO_SAVE_INTERVAL);
      return () => {
        if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
      };
    }
  }, [examStatus, userAnswers, saveToStorage, saveToServer, isRecovering]);

  // ===== Timer =====
  useEffect(() => {
    if (examStatus === 'in-progress' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft <= 0 && examStatus === 'in-progress') {
      setExamStatus('time-up');
      saveToServer(userAnswers);
      clearStorage();
      Modal.warning({ title: 'Hết giờ làm bài!' });
    }
  }, [examStatus, timeLeft, saveToServer, userAnswers, clearStorage]);

  // Handle answer change
  const handleAnswerChange = useCallback(
    (qid: string, ans: string | string[] | number) => {
      const idx = questions.findIndex(q => q.question_id === qid);
      setUserAnswers(prev => {
        const newAnswers = { ...prev, [qid]: ans };
        saveToStorage({ userAnswers: newAnswers });
        return newAnswers;
      });
      if (idx !== -1) {
        setAnsweredQuestions(prev => new Set([...prev, idx]));
      }
    },
    [questions, saveToStorage]
  );

  // ===== Navigation =====
  const handleQuestionNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
    document
      .getElementById(`question-${questions[index].question_id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    saveToStorage({ currentQuestionIndex: index });
    if (isMobile) setDrawerVisible(false);
  };

  const handleStartExam = () => {
    const startTime = Date.now();
    setExamStatus('in-progress');
    setExamStartTime(startTime);
    saveToStorage({ examStatus: 'in-progress', examStartTime: startTime });
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitModalVisible(false);
    setExamStatus('submitted');
    await saveToServer(userAnswers);
    autoSaveIntervalRef.current && clearInterval(autoSaveIntervalRef.current);
    clearStorage();
    notification.success({ message: 'Nộp bài thành công!' });
  };

  // ===== FIX 2: Scroll tracking bằng IntersectionObserver =====
  useEffect(() => {
    if (examStatus !== 'in-progress' || !questions.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // câu ở gần đỉnh viewport nhất và đang hiển thị
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const topEl = visible[0].target as HTMLElement;
          const idx = questions.findIndex(q => `question-${q.question_id}` === topEl.id);
          if (idx !== -1) setCurrentQuestionIndex(idx);
        }
      },
      {
        root: null,
        // đẩy ngưỡng để chọn phần tử khi nó đã đi vào vùng nhìn
        rootMargin: isMobile ? '-100px 0px -60% 0px' : '-140px 0px -55% 0px',
        threshold: 0.3,
      }
    );

    questions.forEach(q => {
      const el = document.getElementById(`question-${q.question_id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [questions, examStatus, isMobile]);

  // ===== Memo hóa tập câu đã trả lời =====
  const answeredSet = useMemo(
    () => new Set(Array.from(answeredQuestions).map(i => questions[i]?.question_id ?? i)),
    [answeredQuestions, questions]
  );
  // ===== UI =====
  if (error) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <Alert message="Lỗi" description={error} type="error" />
      </div>
    );
  }

  // UI
  if (error) {
    return <div style={{ padding: 50, textAlign: 'center' }}><Alert message="Lỗi" description={error} type="error" /></div>;
  }

  if (examStatus === 'not-started') {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Content
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '12px' : '24px',
          }}
        >
          <Card
            title={
              <div style={{ 
                textAlign: 'center', 
                fontSize: isMobile ? '18px' : '24px', 
                fontWeight: 'bold',
                lineHeight: 1.3
              }}>
                {examDetail.title} - {examDetail.school_year}
              </div>
            }
            style={{
              width: '100%',
              maxWidth: isMobile ? '100%' : '600px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              margin: isMobile ? '0' : 'auto'
            }}
          >
            <div>
              <div style={{ marginBottom: isMobile ? '20px' : '30px' }}>
                <h3 style={{ 
                  color: '#1890ff', 
                  marginBottom: '12px',
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: 1.4
                }}>
                  🎯 Chào mừng bạn đến với bài thi môn {examDetail.subject_name}, {examDetail.grade_name}!
                </h3>
                <div style={{ 
                  fontSize: isMobile ? '14px' : '16px', 
                  color: '#666', 
                  lineHeight: '1.5',
                  textAlign: 'left',
                  background: '#fafafa',
                  padding: isMobile ? '12px' : '16px',
                  borderRadius: '6px',
                  margin: isMobile ? '12px 0' : '16px 0'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    ⏱️ Thời gian làm bài: <strong>{examDetail.duration_minutes} phút</strong>
                  </p>
                  <p style={{ margin: '0' }}>
                    📝 Tổng số câu hỏi: <strong>{examDetail.total_questions} câu</strong>
                  </p>
                </div>
              </div>
              <div
                style={{
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '6px',
                  padding: isMobile ? '12px' : '16px',
                  marginBottom: isMobile ? '20px' : '30px',
                  textAlign: 'left'
                }}
              >
                <p style={{ 
                  margin: 0, 
                  color: '#389e0d',
                  fontSize: isMobile ? '13px' : '14px',
                  lineHeight: 1.4
                }}>
                  💡 <strong>Lưu ý:</strong> Bài làm sẽ được tự động lưu mỗi 10 giây. Nếu thoát giữa chừng, bạn có thể tiếp tục làm bài sau.
                </p>
              </div>
              <Button
                type="primary"
                size={isMobile ? 'middle' : 'large'}
                onClick={handleStartExam}
                style={{
                  height: isMobile ? '44px' : '50px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 'bold',
                  width: isMobile ? '100%' : 'auto',
                  minWidth: isMobile ? 'auto' : '200px',
                }}
              >
                🚀 Bắt đầu làm bài
              </Button>
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }


  const headerHeight = isMobile ? 60 : 80;
return (
    <>
      <ExamHeader
        title={examDetail.title}
        timeLeft={timeLeft}
        onSubmit={() => setIsSubmitModalVisible(true)}
        examStatus={examStatus}
        totalQuestions={questions.length}
        answeredCount={answeredSet.size}
      />

      {isMobile && examStatus === 'in-progress' && (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, borderRadius: '50%' }}
        />
      )}

      {!isMobile ? (
        <div style={{ marginTop: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}>
          <PanelGroup direction="horizontal" style={{ height: '100%' }}>
            <Panel minSize={50} style={{ overflowY: 'auto', padding: '24px 32px' }}>
                <QuestionList
                  questions={questions}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  examStatus={examStatus}
                  currentQuestionIndex={currentQuestionIndex}
                  isMobile={false}
                />
            </Panel>

            <PanelResizeHandle style={{ width: '2px', background: '#e0e0e0', cursor: 'col-resize' }} />

            <Panel minSize={15} maxSize={30} defaultSize={22} style={{ overflowY: 'auto' }}>
              <QuestionNav
                questions={questions}
                currentIndex={currentQuestionIndex}
                onSelect={handleQuestionNavigate}
                answeredSet={answeredSet}
                showAll={showAllQuestions}
                // onToggleView={handleToggleView}
                extraContent={<div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 12, padding: 12 }}>💡 Mẹo: Click vào số câu để nhảy nhanh.</div>}
              />
            </Panel>
          </PanelGroup>
        </div>
      ) : (
        <>
          <div style={{ marginTop: `${headerHeight}px`, padding: '12px 8px' }}>
            <QuestionList
              questions={questions}
              userAnswers={userAnswers}
              onAnswerChange={handleAnswerChange}
              examStatus={examStatus}
              currentQuestionIndex={currentQuestionIndex}
              isMobile={true}
            />
          </div>

          <Drawer
            title="Danh sách câu hỏi"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width="280px"
          >
              <QuestionNav
                questions={questions}
                currentIndex={currentQuestionIndex}
                onSelect={handleQuestionNavigate}
                answeredSet={answeredSet}
                showAll={showAllQuestions}
                // onToggleView={handleToggleView}
                extraContent={<div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 12, padding: 12 }}>💡 Mẹo: Click vào số câu để nhảy nhanh.</div>}
              />
          </Drawer>
        </>
      )}

      <Modal
        title="🎯 Xác nhận nộp bài"
        open={isSubmitModalVisible}
        onOk={handleConfirmSubmit}
        onCancel={() => setIsSubmitModalVisible(false)}
        okText="✅ Nộp bài"
        cancelText="❌ Hủy"
        centered
      >
        <p>Đã trả lời: <strong>{answeredSet.size}/{questions.length}</strong> câu</p>
        <p>Thời gian còn lại: <strong>{Math.floor(timeLeft / 60)} phút</strong></p>
      </Modal>
    </>
  );
}
