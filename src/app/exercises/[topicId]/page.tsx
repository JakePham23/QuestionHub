// src/app/exam/[versionId]/page.tsx
import ExercisePage from './ExercisePage';
import { Alert } from 'antd';
import exerciseService from '@/services/exercise.service';
import { StudyQuestion, AnswerCorrect } from '@/types/exercise.type';

type Params = Promise<{ topicId: number }>

export default async function ExamDataFetcher({ params }: { params: Params }) {
  const { topicId } = await params;

  let questions: StudyQuestion[] = [];
  let answerCorrects: AnswerCorrect[] = [];
  

    const data1 = await exerciseService.getExerciseData(topicId);
    const data2 = await exerciseService.getAnswerCorrectByTopic(topicId);
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