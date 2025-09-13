// src/app/exam/[versionId]/page.tsx
import ExercisePage from './ExercisePage';
import { Alert } from 'antd';
import { getExerciseData, getAnswerCorrectByTopic } from '@/services/exercise.service';
import { StudyQuestion, AnswerCorrect } from '@/types/exercise.type';

type Params = { topicId: number };

export default async function ExamDataFetcher({ params }: { params: Params }) {
  const { topicId } = await params;

  let questions: StudyQuestion[] = [];
  let answerCorrects: AnswerCorrect[] = [];
  

    const data1 = await getExerciseData(topicId);
    const data2 = await getAnswerCorrectByTopic(topicId);
    // const data2 = 
    questions = data1.questions || [];
    answerCorrects = data2.answerCorrects || [];


  return (
    <ExercisePage
      topicId={topicId}
      initialQuestions={questions}
      initialAnswerCorrects={answerCorrects}
    />
  );
}