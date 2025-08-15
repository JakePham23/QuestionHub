'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Spin, Alert, Modal, Card, Button, App } from 'antd';
import QuestionList from './components/QuestionList';
import ExamHeader from './components/ExamHeader';
import QuestionNavigation from './components/QuestionNavigation';
import React from 'react';

const { Content, Sider } = Layout;
// Khai báo các hằng số
const EXAM_DURATION_SECONDS = 5400;
const AUTO_SAVE_INTERVAL = 10000; // Auto-save mỗi 10 giây
const STORAGE_KEY = 'exam_data_'; // Prefix cho localStorage key

// Định nghĩa các kiểu dữ liệu
interface Question {
  question_id: string; // Đảm bảo tương thích với QuestionNavigation
  id?: string; // Nếu vẫn cần trường id cho các component khác
  question_type: string;
  question_content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface UserAnswers {
  [questionId: string]: string | string[] | number; // Kiểu dữ liệu phù hợp với câu trả lời
}

type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'time-up';

interface SavedExamData {
  userAnswers: UserAnswers;
  timeLeft: number;
  examStatus: ExamStatus;
  examStartTime: number | null;
  currentQuestionIndex: number;
  lastSaved: number;
}

interface ExamPageProps {
  versionId: string;
  initialQuestions: Question[];
  initialError: string | null;
}

export default function ExamPage({
  versionId,
  initialQuestions,
  initialError,
}: ExamPageProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(initialError);

  const [timeLeft, setTimeLeft] = useState<number>(EXAM_DURATION_SECONDS);
  const [examStatus, setExamStatus] = useState<ExamStatus>('not-started');
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);

  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_KEY}${versionId}`;
  const { message, notification, modal } = App.useApp();

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
              // Thêm header này để bỏ qua cảnh báo của ngrok
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
        // Vẫn save local nếu server fail
        saveToStorage({ userAnswers: answers });
      }
    },
    [versionId, timeLeft, examStatus, saveToStorage]
  );

  // ===== RECOVERY ON PAGE LOAD =====
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData && savedData.examStatus !== 'submitted') {
      setIsRecovering(true);

      // Use Modal.confirm directly instead of modal.confirm from App context
      modal.confirm({
        title: '🔄 Khôi phục bài làm',
        content: (
          <div>
            <p>Hệ thống phát hiện bài làm chưa hoàn thành từ lần trước:</p>
            <ul>
              <li>
                Đã trả lời: <strong>{Object.keys(savedData.userAnswers || {}).length}</strong> câu
              </li>
              <li>
                Thời gian còn lại: <strong>{Math.floor(savedData.timeLeft / 60)} phút {savedData.timeLeft % 60} giây
                </strong>
              </li>
              <li>
                Lần lưu cuối: <strong>{new Date(savedData.lastSaved).toLocaleTimeString()}</strong>
              </li>
            </ul>
            <p>Bạn có muốn tiếp tục bài làm này không?</p>
          </div>
        ),
        okText: '✅ Tiếp tục làm bài',
        cancelText: '🆕 Làm bài mới',
        onOk: () => {
          setUserAnswers(savedData.userAnswers || {});
          setTimeLeft(savedData.timeLeft ?? EXAM_DURATION_SECONDS);
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
    }
  }, [loadFromStorage, clearStorage]);

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
        // Debounced save - chỉ save sau 2 giây không có thay đổi
        setTimeout(() => {
          saveToStorage({ userAnswers: newAnswers });
        }, 2000);
        return newAnswers;
      });
    },
    [saveToStorage]
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

    // Final save to server
    await saveToServer(userAnswers);

    // Clear auto-save timer
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    // Clear local storage sau khi submit thành công
    clearStorage();

    notification.success({
      message: 'Nộp bài thành công!',
      description: 'Hệ thống đang chấm điểm, kết quả sẽ có sớm thôi.',
    });
  };

  const handleQuestionNavigate = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(index);
      const questionElement = document.getElementById(`question-${index}`);
      if (questionElement) {
        questionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      // Save navigation position
      saveToStorage({ currentQuestionIndex: index });
    },
    [saveToStorage]
  );

  // ===== EXAM TIMER =====
  useEffect(() => {
    if (examStatus === 'in-progress' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Save time every minute
          if (newTime % 60 === 0) {
            saveToStorage({ timeLeft: newTime });
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && examStatus === 'in-progress') {
      setExamStatus('time-up');
      // Auto-submit và clear storage
      saveToServer(userAnswers);
      clearStorage();
      // Use Modal.warning directly
      Modal.warning({
        title: 'Hết giờ làm bài!',
        content: 'Bài làm của bạn đã được tự động nộp.',
      });
    }
  }, [examStatus, timeLeft, saveToStorage, saveToServer, userAnswers, clearStorage]);

  // ===== SCROLL TRACKING =====
  useEffect(() => {
    if (examStatus !== 'in-progress') return;
    const handleScroll = () => {
      const questionElements = questions
        .map((_, index) => document.getElementById(`question-${index}`))
        .filter(Boolean) as HTMLElement[];
      let currentIndex = 0;
      const scrollTop = window.scrollY + 200;
      for (let i = 0; i < questionElements.length; i++) {
        if (questionElements[i].offsetTop <= scrollTop) {
          currentIndex = i;
        }
      }
      setCurrentQuestionIndex(currentIndex);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [questions, examStatus]);

  // ===== BEFORE UNLOAD WARNING =====
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examStatus === 'in-progress') {
        saveToStorage({});
        saveToServer(userAnswers);

        e.preventDefault();
        e.returnValue = 'Bạn có chắc muốn rời khỏi trang? Bài làm sẽ được tự động lưu.';
        return 'Bạn có chắc muốn rời khỏi trang? Bài làm sẽ được tự động lưu.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examStatus, saveToStorage, saveToServer, userAnswers]);

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  // Sửa lỗi: Spin 'tip' only work...
  // Bọc Spin trong một div có kích thước cụ thể.
  if (isRecovering) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" tip="Đang khôi phục bài làm...">
          <div style={{ minHeight: 200 }}></div>
        </Spin>
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
            padding: '24px',
          }}
        >
          <Card
            title={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Đề thi mã số {versionId}
              </div>
            }
            style={{
              width: '100%',
              maxWidth: '600px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ padding: '40px 20px' }}>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#1890ff', marginBottom: '16px' }}>🎯 Chào mừng bạn đến với bài thi!</h3>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  Thời gian làm bài: <strong>{Math.floor(EXAM_DURATION_SECONDS / 60)} phút</strong>
                </p>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  Tổng số câu hỏi: <strong>{questions.length} câu</strong>
                </p>
              </div>

              <div
                style={{
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '30px',
                }}
              >
                <p style={{ margin: 0, color: '#389e0d' }}>
                  💡 <strong>Lưu ý:</strong> Bài làm sẽ được tự động lưu mỗi 10 giây. Nếu thoát giữa chừng, bạn có thể tiếp tục làm bài sau.
                </p>
              </div>

              <Button
                type="primary"
                size="large"
                onClick={handleStartExam}
                style={{
                  height: '50px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  minWidth: '200px',
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

  // Container để tạo khoảng trống cho fixed header
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <ExamHeader
        versionId={versionId}
        timeLeft={timeLeft}
        onSubmit={handleSubmitExam}
        examStatus={examStatus}
        totalQuestions={questions.length}
        answeredCount={Object.keys(userAnswers).length}
      />
      
      <Layout style={{ marginTop: '80px' }}>
        <Sider
          width={280}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            height: 'calc(100vh - 80px)', // Adjust height based on header height
            position: 'fixed',
            top: '80px', // Adjust top based on header height
            overflow: 'auto',
          }}
          collapsible
          collapsed={siderCollapsed}
          onCollapse={(collapsed) => setSiderCollapsed(collapsed)}
          collapsedWidth={60}
        >
          <QuestionNavigation
            questions={questions}
            userAnswers={userAnswers}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionClick={handleQuestionNavigate}
            collapsed={siderCollapsed}
            examStatus={examStatus}
          />
        </Sider>

        <Content
          style={{
            padding: '24px 32px',
            minHeight: 'calc(100vh - 80px)', // Adjust height based on header height
            overflowY: 'auto', // Ensure Content can scroll independently
            marginLeft: siderCollapsed ? '60px' : '280px',
            transition: 'margin-left 0.2s',
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <QuestionList
              questions={questions}
              userAnswers={userAnswers}
              onAnswerChange={handleAnswerChange}
              examStatus={examStatus}
              currentQuestionIndex={currentQuestionIndex}
            />
          </div>
        </Content>
      </Layout>

      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>🎯 Xác nhận nộp bài</div>
          </div>
        }
        open={isSubmitModalVisible}
        onOk={handleConfirmSubmit}
        onCancel={() => setIsSubmitModalVisible(false)}
        okText="✅ Nộp bài"
        cancelText="❌ Hủy"
        width={500}
        centered
      >
        <div style={{ padding: '20px 0' }}>
          <div
            style={{
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '16px' }}>
              <strong>Thống kê bài làm:</strong>
            </p>
            <p style={{ margin: '8px 0 0 0' }}>
              • Đã trả lời: <strong>{Object.keys(userAnswers).length}/{questions.length}</strong> câu
            </p>
            <p style={{ margin: '4px 0 0 0' }}>
              • Thời gian còn lại: <strong>{Math.floor(timeLeft / 60)} phút {timeLeft % 60} giây
              </strong>
            </p>
          </div>

          <p style={{ fontSize: '16px', textAlign: 'center', color: '#666' }}>
            ⚠️ Bạn có chắc chắn muốn nộp bài không?
            <br />
            <small>Sau khi nộp bài, bạn sẽ không thể chỉnh sửa được nữa.</small>
          </p>
        </div>
      </Modal>
    </Layout>
  );
}