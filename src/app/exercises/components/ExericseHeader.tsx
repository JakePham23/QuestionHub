'use client'
import { Book, RotateCcw, ArrowLeft, Save } from 'lucide-react';
import { Button, Typography, Grid, Space, App } from 'antd';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface ExerciseHeaderProps {
  handleGoBack: () => void;
  handleReset: () => void;
  handleSubmitAll: () => Promise<void>; // ✅ thêm mới
  isMobile: boolean;
  setIsDrawerVisible: (value: boolean) => void;
}

export default function ExerciseHeader({
  handleGoBack,
  handleReset,
  handleSubmitAll,
  isMobile,
  setIsDrawerVisible
}: ExerciseHeaderProps) {

  const screens = useBreakpoint();
  const mobile = !screens.lg;
  const { modal } = App.useApp();

  const confirmSubmit = () => {
    modal.confirm({
      title: 'Xác nhận nộp bài',
      content: 'Bạn có chắc muốn gửi toàn bộ đáp án đã chọn?',
      okText: 'Gửi',
      cancelText: 'Hủy',
      onOk: handleSubmitAll
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fafafa',
        padding: mobile ? '6px 12px' : '12px 20px',
        borderBottom: '1px solid #ddd',
        borderRadius: 8
      }}
    >
      {/* Left */}
      <Space align="center" size={mobile ? 4 : 8}>
        <Button
          type="text"
          icon={<ArrowLeft size={mobile ? 18 : 20} />}
          onClick={handleGoBack}
          style={{ display: 'flex', alignItems: 'center', padding: 0 }}
        >
          {!mobile && 'Quay lại'}
        </Button>

        <Space align="center" size={mobile ? 4 : 8}>
          <Book size={mobile ? 20 : 24} style={{marginTop: 2}}/>
          <Title level={mobile ? 5 : 4} style={{ margin: 0 }}>
            Luyện tập
          </Title>
        </Space>
      </Space>

      {/* Right */}
      <Space size={mobile ? 4 : 8}>
        <Button
          onClick={handleReset}
          icon={<RotateCcw size={mobile ? 14 : 16} />}
          size={mobile ? 'middle' : 'large'}
        >
          {!mobile && 'Làm lại'}
        </Button>
{/* 
        <Button
          type="primary"
          icon={<Save size={mobile ? 14 : 16} />}
          size={mobile ? 'middle' : 'large'}
          onClick={confirmSubmit}
        >
          {!mobile && 'Lưu đáp án'}
        </Button> */}
      </Space>
    </div>
  );
}
