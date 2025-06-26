import React, { useState } from 'react';
import { Card, Typography, Button, Space, Collapse, Radio, Checkbox, Input, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { ListeningPracticeCustomDto } from '@/types/listeningPractice';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

interface PracticeQuestionsProps {
  practices: ListeningPracticeCustomDto[];
  className?: string;
}

interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect?: boolean;
}

const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({
  practices,
  className = '',
}) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, answer } : a);
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };

  const checkAnswers = () => {
    const checkedAnswers = practices.map(practice => {
      const userAnswer = userAnswers.find(a => a.questionId === practice.id);
      const isCorrect = userAnswer?.answer.toLowerCase().trim() === 
                       practice.answer.toLowerCase().trim();
      
      return {
        questionId: practice.id,
        answer: userAnswer?.answer || '',
        isCorrect,
      };
    });

    setUserAnswers(checkedAnswers);
    setShowAnswers(true);
    
    const correctCount = checkedAnswers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctCount / practices.length) * 100);
    
    message.success(`You got ${correctCount} out of ${practices.length} correct (${percentage}%)`);
  };

  const resetQuiz = () => {
    setUserAnswers([]);
    setShowAnswers(false);
    setCurrentQuestionIndex(0);
  };

  const getCurrentUserAnswer = (questionId: number) => {
    return userAnswers.find(a => a.questionId === questionId)?.answer || '';
  };

  const isAnswerCorrect = (questionId: number) => {
    return userAnswers.find(a => a.questionId === questionId)?.isCorrect;
  };

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="mb-0">Practice Questions</Title>
          <Space>
            {!showAnswers && (
              <Button type="primary" onClick={checkAnswers}>
                Check Answers
              </Button>
            )}
            {showAnswers && (
              <Button onClick={resetQuiz}>
                Try Again
              </Button>
            )}
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? 'Hide' : 'Show'} Answers
            </Button>
          </Space>
        </div>
      }
      className={`practice-questions ${className}`}
    >
      {practices.length === 0 ? (
        <div className="text-center py-8">
          <Text type="secondary">No practice questions available</Text>
        </div>
      ) : (
        <div className="space-y-6">
          {practices.map((practice, index) => (
            <Card 
              key={practice.id}
              size="small"
              className={`question-card ${
                showAnswers && isAnswerCorrect(practice.id) === false
                  ? 'border-red-300 bg-red-50'
                  : showAnswers && isAnswerCorrect(practice.id) === true
                  ? 'border-green-300 bg-green-50'
                  : ''
              }`}
            >
              <div className="space-y-4">
                {/* Question */}
                <div>
                  <Title level={5} className="mb-2">
                    Question {index + 1}: {practice.question}
                  </Title>
                </div>

                {/* Answer Input */}
                <div>
                  <TextArea
                    rows={3}
                    placeholder="Type your answer here..."
                    value={getCurrentUserAnswer(practice.id)}
                    onChange={(e) => handleAnswerChange(practice.id, e.target.value)}
                    disabled={showAnswers}
                    className={`${
                      showAnswers && isAnswerCorrect(practice.id) === false
                        ? 'border-red-500'
                        : showAnswers && isAnswerCorrect(practice.id) === true
                        ? 'border-green-500'
                        : ''
                    }`}
                  />
                </div>

                {/* Correct Answer (shown when answers are revealed) */}
                {showAnswers && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {isAnswerCorrect(practice.id) ? (
                        <CheckCircleOutlined className="text-green-500 text-lg" />
                      ) : (
                        <CloseCircleOutlined className="text-red-500 text-lg" />
                      )}
                      <Text strong>
                        {isAnswerCorrect(practice.id) ? 'Correct!' : 'Incorrect'}
                      </Text>
                    </div>
                    
                    <div className="bg-gray-100 p-3 rounded">
                      <Text strong>Correct Answer:</Text>
                      <Paragraph className="mb-0 mt-1">
                        {practice.answer}
                      </Paragraph>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {showAnswers && userAnswers.length > 0 && (
        <Card className="mt-6 bg-blue-50">
          <div className="text-center">
            <Title level={4}>Quiz Summary</Title>
            <div className="space-y-2">
              <Text>
                Correct Answers: {userAnswers.filter(a => a.isCorrect).length} / {practices.length}
              </Text>
              <br />
              <Text>
                Score: {Math.round((userAnswers.filter(a => a.isCorrect).length / practices.length) * 100)}%
              </Text>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};

export default PracticeQuestions; 