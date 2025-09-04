'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Alert, Modal, Card, Button, Drawer } from 'antd';
import QuestionList from '../../../components/questions/QuestionList';
import ExamHeader from '../components/ExamHeader';
import QuestionNavigation from '../../../components/questions/QuestionNavigation';
import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { useNotify } from '@/providers/NotificationProvider';

// Import all necessary types from the centralized file
import {
  Answer,
  Question,
  ExamDetail,
  UserAnswers,
  ExamStatus,
  SavedExamData,
} from '@/types/exam.type';

const { Content } = Layout;

// Khai báo các hằng số
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
  // ... (rest of the component logic remains the same)
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState<boolean>(false);
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

  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_KEY}${versionId}`;
  const { notification, modal } = useNotify();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Thêm một effect để xử lý trạng thái loading và error ban đầu từ props
  useEffect(() => {
    if (initialError) {
      setError(initialError);
      setLoading(false);
    } else {
      setQuestions(initialQuestions);
      setLoading(false);
      // Logic khôi phục được chuyển vào đây
      const savedData = loadFromStorage();
      if (savedData && savedData.examStatus !== 'submitted') {
        modal.confirm({
          title: '🔄 Khôi phục bài làm',
          content: (
            <div>
              <p>Hệ thống phát hiện bài làm chưa hoàn thành từ lần trước:</p>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
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
            setExamStartTime(savedData.examStartTime);
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
    }
  }, [initialQuestions, initialError, versionId, modal, notification]);

  // ===== AUTO-SAVE FUNCTIONS =====
  const saveToStorage = useCallback(
    (data: Partial<SavedExamData>) => {
      try {
        const examData: SavedExamData = {
          userAnswers: data.userAnswers || userAnswers,
          timeLeft: data.timeLeft ?? timeLeft,
          examStatus: data.examStatus || examStatus,
          examStartTime: data.examStartTime || examStartTime,
          currentQuestionIndex: data.currentQuestionIndex ?? currentQuestionIndex,
          lastSaved: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(examData));
        console.log('💾 Auto-saved exam data');
      } catch (error) {
        console.error('Failed to save exam data:', error);
      }
    },
    [storageKey, userAnswers, timeLeft, examStatus, examStartTime, currentQuestionIndex]
  );

  const loadFromStorage = useCallback((): SavedExamData | null => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const examData = JSON.parse(savedData) as SavedExamData;
        return examData;
      }
    } catch (error) {
      console.error('Failed to load exam data:', error);
    }
    return null;
  }, [storageKey]);

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      console.log('🗑️ Cleared exam data from storage');
    } catch (error) {
      console.error('Failed to clear exam data:', error);
    }
  }, [storageKey]);

  // ===== AUTO-SAVE API CALL =====
  const saveToServer = useCallback(
    async (answers: UserAnswers) => {
      if (!answers || Object.keys(answers).length === 0) return;
      try {
        const response = await fetch(`/api/exam/${versionId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            answers: answers,
            timeLeft: timeLeft,
            examStatus: examStatus,
            lastActivity: Date.now(),
          }),
        });

        if (response.ok) {
          console.log('☁️ Saved to server successfully');
        } else {
          console.error('Failed to save to server');
        }
      } catch (error) {
        console.error('Server save error:', error);
        saveToStorage({ userAnswers: answers });
      }
    },
    [versionId, timeLeft, examStatus, saveToStorage]
  );

  // ===== AUTO-SAVE TIMER =====
  useEffect(() => {
    if (examStatus === 'in-progress' && !isRecovering) {
      autoSaveIntervalRef.current = setInterval(() => {
        saveToStorage({});
        saveToServer(userAnswers);
      }, AUTO_SAVE_INTERVAL);

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [examStatus, userAnswers, saveToStorage, saveToServer, isRecovering]);

  // ===== SAVE ON ANSWER CHANGE =====
  const handleAnswerChange = useCallback(
    (questionId: string, answer: string | string[] | number) => {
      setUserAnswers((prev) => {
        const newAnswers = { ...prev, [questionId]: answer };
        return newAnswers;
      });
      saveToStorage({ userAnswers });
    },
    [saveToStorage, userAnswers]
  );

  const handleStartExam = () => {
    const startTime = Date.now();
    setExamStatus('in-progress');
    setExamStartTime(startTime);
    saveToStorage({
      examStatus: 'in-progress',
      examStartTime: startTime,
    });
  };

  const handleSubmitExam = useCallback(() => {
    setIsSubmitModalVisible(true);
  }, []);

  const handleConfirmSubmit = async () => {
    setIsSubmitModalVisible(false);
    setExamStatus('submitted');

    await saveToServer(userAnswers);

    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    clearStorage();

    notification.success({
      message: 'Nộp bài thành công!',
      description: 'Hệ thống đang chấm điểm, kết quả sẽ có sớm thôi.',
    });
  };

  const handleQuestionNavigate = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(index);
      const questionElement = document.getElementById(`question-${questions[index].question_id}`);
      if (questionElement) {
        questionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      saveToStorage({ currentQuestionIndex: index });
      if (isMobile) {
        setDrawerVisible(false);
      }
    },
    [questions, saveToStorage, isMobile]
  );

  // ===== EXAM TIMER =====
  useEffect(() => {
    if (examStatus === 'in-progress' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime % 60 === 0) {
            saveToStorage({ timeLeft: newTime });
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft <= 0 && examStatus === 'in-progress') {
      setExamStatus('time-up');
      saveToServer(userAnswers);
      clearStorage();
      Modal.warning({
        title: 'Hết giờ làm bài!',
        content: 'Bài làm của bạn đã được tự động nộp.',
      });
    }
  }, [examStatus, timeLeft, saveToStorage, saveToServer, userAnswers, clearStorage]);

  // ===== SCROLL TRACKING =====
  useEffect(() => {
    if (examStatus !== 'in-progress' || !questions.length) return;
    const handleScroll = () => {
      const questionElements = questions
        .map((q) => document.getElementById(`question-${q.question_id}`))
        .filter(Boolean) as HTMLElement[];
      let currentIndex = 0;
      const scrollTop = window.scrollY + (isMobile ? 120 : 200);
      for (let i = 0; i < questionElements.length; i++) {
        if (questionElements[i].offsetTop <= scrollTop) {
          currentIndex = i;
        }
      }
      setCurrentQuestionIndex(currentIndex);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [questions, examStatus, isMobile]);

  // ===== BEFORE UNLOAD WARNING =====
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examStatus === 'in-progress') {
        saveToStorage({});
        saveToServer(userAnswers);
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examStatus, saveToStorage, saveToServer, userAnswers]);

  if (error) {
    return (
      <div style={{ 
        padding: isMobile ? '16px' : '50px', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
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
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <ExamHeader
        title={examDetail.title}
        timeLeft={timeLeft}
        onSubmit={handleSubmitExam}
        examStatus={examStatus}
        totalQuestions={questions.length}
        answeredCount={Object.keys(userAnswers).length}
      />
      
      {/* Mobile Navigation Button */}
      {isMobile && examStatus === 'in-progress' && (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        />
      )}
      
      <Layout style={{ marginTop: `${headerHeight}px` }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div
            style={{
              width: '240px',
              background: '#fff',
              borderRight: '1px solid #f0f0f0',
              height: `calc(100vh - ${headerHeight}px)`,
              position: 'fixed',
              top: `${headerHeight}px`,
              overflow: 'auto',
              zIndex: 100
            }}
          >
            <QuestionNavigation
              questions={questions}
              userAnswers={userAnswers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionClick={handleQuestionNavigate}
              collapsed={false}
              examStatus={examStatus}
            />
          </div>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            title="Danh sách câu hỏi"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width="280px"
          >
            <QuestionNavigation
              questions={questions}
              userAnswers={userAnswers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionClick={handleQuestionNavigate}
              collapsed={false}
              examStatus={examStatus}
            />
          </Drawer>
        )}
        
        <Content
          style={{
            padding: isMobile ? '12px 8px' : '24px 32px',
            minHeight: `calc(100vh - ${headerHeight}px)`,
            overflowY: 'auto',
            marginLeft: isMobile ? 0 : '240px',
            paddingBottom: isMobile ? '80px' : '24px'
          }}
        >
          <div
            style={{
              maxWidth: isMobile ? '100%' : '900px',
              margin: '0 auto',
              background: '#fff',
              borderRadius: isMobile ? '4px' : '8px',
              boxShadow: isMobile ? '0 1px 4px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <QuestionList
              questions={questions}
              userAnswers={userAnswers}
              onAnswerChange={handleAnswerChange}
              examStatus={examStatus}
              currentQuestionIndex={currentQuestionIndex}
              isMobile={isMobile}
            />
          </div>
        </Content>
      </Layout>
      
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: isMobile ? '18px' : '20px', 
              fontWeight: 'bold', 
              color: '#1890ff' 
            }}>
              🎯 Xác nhận nộp bài
            </div>
          </div>
        }
        open={isSubmitModalVisible}
        onOk={handleConfirmSubmit}
        onCancel={() => setIsSubmitModalVisible(false)}
        okText="✅ Nộp bài"
        cancelText="❌ Hủy"
        width={isMobile ? '90%' : 500}
        centered
        style={isMobile ? { top: 20 } : {}}
      >
        <div style={{ padding: isMobile ? '12px 0' : '20px 0' }}>
          <div
            style={{
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
              padding: isMobile ? '12px' : '16px',
              marginBottom: isMobile ? '16px' : '20px',
            }}
          >
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? '14px' : '16px' 
            }}>
              <strong>Thống kê bài làm:</strong>
            </p>
            <p style={{ 
              margin: '6px 0 0 0',
              fontSize: isMobile ? '13px' : '14px'
            }}>
              • Đã trả lời: <strong>{Object.keys(userAnswers).length}/{questions.length}</strong> câu
            </p>
            <p style={{ 
              margin: '4px 0 0 0',
              fontSize: isMobile ? '13px' : '14px'
            }}>
              • Thời gian còn lại: <strong>{Math.floor(timeLeft / 60)} phút {timeLeft % 60} giây</strong>
            </p>
          </div>
          <p style={{ 
            fontSize: isMobile ? '14px' : '16px', 
            textAlign: 'center', 
            color: '#666',
            lineHeight: 1.4,
            margin: 0
          }}>
            ⚠️ Bạn có chắc chắn muốn nộp bài không?
            <br />
            <small>Sau khi nộp bài, bạn sẽ không thể chỉnh sửa được nữa.</small>
          </p>
        </div>
      </Modal>
    </Layout>
  );
}