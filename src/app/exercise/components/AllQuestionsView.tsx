import React from 'react';
import { AllQuestionsViewProps } from '@/types/exercise.type';
import StudyModeCard from './StudyModeCard';

const AllQuestionsView: React.FC<AllQuestionsViewProps> = ({
  questions,
  userAnswers,
  onAnswerSelect,
  onToggleAnswer,
  showAnswers
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {questions.map((question, index) => (
      <StudyModeCard
        key={question.question_id}
        question={question}
        index={index}
        userAnswer={userAnswers[question.question_id] as number | undefined}
        onAnswerSelect={(answerIndex) => onAnswerSelect(question.question_id, answerIndex)}
        showAnswer={showAnswers.has(question.question_id)}
        onToggleAnswer={() => onToggleAnswer(question.question_id)}
      />
    ))}
  </div>
);

export default AllQuestionsView;