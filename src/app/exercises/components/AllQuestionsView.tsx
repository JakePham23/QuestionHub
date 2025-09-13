'use client'
import React from 'react';
import { AllQuestionsViewProps } from '@/types/exercise.type';
import StudyCard from '@/components/questions/QuestionCard';

const AllQuestionsView: React.FC<AllQuestionsViewProps> = ({
  questions,
  userAnswers,
  onAnswerSelect,
  onToggleAnswer,
  showAnswers,
  showAnswerCorrect,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {questions.map((question, index) => (
      <StudyCard
        key={question.question_id}
        question={question}
        index={index}
        userAnswer={userAnswers[question.question_id] as string | number | undefined}
        onAnswerChange={(ans) => onAnswerSelect(question.question_id, ans)}
        showAnswer={showAnswers.has(question.question_id)}
        onToggleAnswer={() => onToggleAnswer(question.question_id)}
        showAnswerCorrect={true}
      />
    ))}
  </div>
);

export default AllQuestionsView;
