// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";
import { api_backend } from "../utils/api";

// Import các component con đã tạo
import HeroSection from "../components/HeroSection";
import CurriculumSelection from "../components/CurriculumSelection";
import ExamResults from "../components/ExamResults";
import "@ant-design/v5-patch-for-react-19";

const { Content } = Layout;

// Định nghĩa các kiểu dữ liệu
interface CurriculumItem {
  grade_id: number;
  grade_name: string;
  subject_id: number;
  subject_name: string;
  chapter_id: number | null;
  chapter_name: string | null;
}

interface GradeItem {
  id: number;
  name: string;
}

interface SubjectItem {
  id: number;
  name: string;
}

interface ExamItem {
  exam_id: string;
  title: string;
  description: string;
  total_questions: number;
  duration_minutes: number;
}

export default function Home() {
  // =================================================================
  // STATE MANAGEMENT
  // =================================================================
  const [curriculumData, setCurriculumData] = useState<CurriculumItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [examLoading, setExamLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [examError, setExamError] = useState<string | null>(null);

  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  // =================================================================
  // DATA FETCHING
  // =================================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_backend}/data_info`, {
          headers: {
            "Content-Type": "application/json",
            // Thêm header này để bỏ qua cảnh báo của ngrok
            "ngrok-skip-browser-warning": "true",
          },
        });
        console.log(api_backend);
        if (!response.ok) {
          throw new Error("Không thể kết nối tới server.");
        }
        const data: CurriculumItem[] = await response.json();
        setCurriculumData(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      // Chỉ return nếu cả gradeId và subjectId đều chưa được chọn
      if (!selectedGradeId && !selectedSubjectId) {
        setExams([]);
        return;
      }

      try {
        setExamLoading(true);
        setExamError(null);

        // Tạo query string với các tham số đã chọn
        const params = new URLSearchParams();
        if (selectedGradeId) {
          params.append("gradeId", String(selectedGradeId));
        }
        if (selectedSubjectId) {
          params.append("subjectId", String(selectedSubjectId));
        }
        const queryString = params.toString();

        // Xây dựng URL với query string
        const url = `${api_backend}/exams?${queryString}`;

        const response = await fetch(url, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          // const errorText = await response.json();
          throw new Error(
            "Đề thi loại này chưa được cập nhật. Vui lòng liên hệ Admin hoặc chờ Admin cập nhật thêm nhé!"
          );
        }

        const data: ExamItem[] = await response.json();
        setExams(data);
      } catch (err) {
        setExams([]);
        if (err instanceof Error) {
          setExamError(err.message);
        } else {
          setExamError("An unexpected error occurred.");
        }
      } finally {
        setExamLoading(false);
      }
    };
    fetchExams();
  }, [selectedGradeId, selectedSubjectId]);

  // =================================================================
  // CASCADING LOGIC (LỌC DỮ LIỆU)
  // =================================================================
  const grades: GradeItem[] = useMemo(() => {
    const gradeMap = new Map<number, GradeItem>();
    curriculumData.forEach((item) => {
      gradeMap.set(item.grade_id, { id: item.grade_id, name: item.grade_name });
    });
    return Array.from(gradeMap.values());
  }, [curriculumData]);

  const subjects: SubjectItem[] = useMemo(() => {
    if (!selectedGradeId) return [];
    const subjectMap = new Map<number, SubjectItem>();
    curriculumData
      .filter((item) => item.grade_id === selectedGradeId)
      .forEach((item) => {
        subjectMap.set(item.subject_id, {
          id: item.subject_id,
          name: item.subject_name,
        });
      });
    return Array.from(subjectMap.values());
  }, [curriculumData, selectedGradeId]);

  const chapters = useMemo(() => {
    if (!selectedGradeId || !selectedSubjectId) return [];
    return curriculumData
      .filter(
        (item) =>
          item.grade_id === selectedGradeId &&
          item.subject_id === selectedSubjectId &&
          item.chapter_id !== null
      )
      .map((item) => ({
        chapter_id: item.chapter_id as string | number,
        chapter_name: item.chapter_name ?? "",
        grade_id: item.grade_id,
        subject_id: item.subject_id,
      }));
  }, [curriculumData, selectedGradeId, selectedSubjectId]);

  const handleGradeSelect = (gradeId: string | number) => {
    setSelectedGradeId(Number(gradeId));
    setSelectedSubjectId(null);
    setSelectedChapterId(null);
  };

  const handleSubjectSelect = (subjectId: string | number) => {
    setSelectedSubjectId(Number(subjectId));
    setSelectedChapterId(null);
  };

  return (
    <Layout>
      <Content>
        <HeroSection />
        <CurriculumSelection
          loading={loading}
          error={error}
          grades={grades}
          subjects={subjects}
          chapters={chapters}
          selectedGradeId={selectedGradeId}
          selectedSubjectId={selectedSubjectId}
          selectedChapterId={selectedChapterId}
          handleGradeSelect={handleGradeSelect}
          handleSubjectSelect={handleSubjectSelect}
          setSelectedChapterId={(chapterId: string | number) =>
            setSelectedChapterId(Number(chapterId))
          }
        />
        <ExamResults
          examLoading={examLoading}
          examError={examError}
          exams={exams}
          selectedGradeId={selectedGradeId}
          selectedSubjectId={selectedSubjectId}
        />
      </Content>
    </Layout>
  );
}
