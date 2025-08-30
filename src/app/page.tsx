// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";

// Import types and services
import {
  CurriculumItem,
  GradeItem,
  SubjectItem,
  ExamItem,
  ChapterItem,
} from "../types/data.type";
import {
  fetchCurriculumData,
  fetchExams,
} from "../services/data.service";

// Import components
import HeroSection from "../components/HeroSection";
import CurriculumSelection from "../components/CurriculumSelection";
import ExamResults from "../components/ExamResults";
import "@ant-design/v5-patch-for-react-19";

const { Content } = Layout;

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
  // DATA FETCHING with Services
  // =================================================================
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchCurriculumData();
        setCurriculumData(data);
        setError(null);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getExams = async () => {
      setExamLoading(true);
      setExamError(null);
      try {
        const data = await fetchExams(selectedGradeId, selectedSubjectId);
        setExams(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setExams([]);
        setExamError(err.message);
      } finally {
        setExamLoading(false);
      }
    };
    getExams();
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

  const chapters: ChapterItem[] = useMemo(() => {
    if (!selectedGradeId || !selectedSubjectId) return [];
    return curriculumData
      .filter(
        (item) =>
          item.grade_id === selectedGradeId &&
          item.subject_id === selectedSubjectId &&
          item.chapter_id !== null
      )
      .map((item) => ({
        chapter_id: item.chapter_id as number,
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