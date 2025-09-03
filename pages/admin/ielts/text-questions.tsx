import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Button, Space, message, Progress, Row, Col } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useGetTextQuestionsQuery, useGetAudioFileQuery, useGetTextQuestionsByCategoryQuery, useSaveUserAnswerMutation } from '@/services/portalHomeApi';
import { BiMicrophone, BiPlay, BiPause, BiRefresh } from 'react-icons/bi';
import Container from '@/components/Container';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

interface TextQuestion {
  id: number;
  question: string;
  sampleAnswer1: string;
  sampleAnswer2: string;
  questionAudioPath: string;
  answer1AudioPath: string;
  answer2AudioPath: string;
  score1: number;
  score2: number;
}

interface ScoreResult {
  accuracy: number;
  correctWords: number;
  totalWords: number;
  mistakes: string[];
  wordResults: Array<{
    word: string;
    isCorrect: boolean;
    expected?: string;
  }>;
}

const TextQuestionsPage: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentSample, setCurrentSample] = useState<1 | 2 | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioBlobs, setAudioBlobs] = useState<{ [key: string]: Blob }>({});
  const [currentAudioPath, setCurrentAudioPath] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({});
  const [isAudioError, setIsAudioError] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedAudioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: questions, isLoading, error } = useGetTextQuestionsByCategoryQuery(
    Number(categoryId),
    { skip: !categoryId }
  );
  const { data: audioBlob, error: audioError } = useGetAudioFileQuery(currentAudioPath || '', {
    skip: !currentAudioPath,
  });
  const [saveUserAnswerMutation] = useSaveUserAnswerMutation();

  useEffect(() => {
    if (error) {
      message.error('Failed to fetch questions');
    }
  }, [error]);

  useEffect(() => {
    if (audioError) {
      message.error('Failed to fetch audio file');
      setCurrentAudioPath(null);
    } else if (audioBlob && currentAudioPath) {
      const audioId = currentAudioPath.split('/').pop() || '';
      setAudioBlobs(prev => ({ ...prev, [audioId]: audioBlob }));
      playAudioFromBlob(audioBlob, audioId);
    }
  }, [audioBlob, audioError, currentAudioPath]);

  useEffect(() => {
    if (!isRecording && transcript && currentSample !== null) {
      const currentQuestion = getCurrentQuestion();
      if (currentQuestion) {
        const result = calculateScore(transcript, currentQuestion.id, currentSample);
        setScore(result);
      }
    }
  }, [isRecording, transcript, currentSample]);

  const getCurrentQuestion = (): TextQuestion | null => {
    const questionsList = Array.isArray(questions) 
      ? questions 
      : questions?.data 
      ? questions.data 
      : [];
    return questionsList[currentQuestionIndex] || null;
  };

  const calculateScore = (userText: string, questionId: number, sample: 1 | 2): ScoreResult => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) {
      return {
        accuracy: 0,
        correctWords: 0,
        totalWords: 0,
        mistakes: ['No question found'],
        wordResults: []
      };
    }

    const originalText = sample === 1 ? currentQuestion.sampleAnswer1 : currentQuestion.sampleAnswer2;
    const originalWords = (originalText || '').toLowerCase().replace(/[.,?]/g, '').split(/\s+/).filter(Boolean);
    const userWords = userText.toLowerCase().replace(/[.,?]/g, '').split(/\s+/).filter(Boolean);
    const mistakes: string[] = [];
    let correctWords = 0;
    const wordResults: Array<{ word: string; isCorrect: boolean; expected?: string }> = [];

    for (let i = 0; i < Math.max(originalWords.length, userWords.length); i++) {
      if (i >= userWords.length) {
        mistakes.push(`Missing: "${originalWords[i]}"`);
        wordResults.push({ word: originalWords[i], isCorrect: false, expected: originalWords[i] });
      } else if (i >= originalWords.length) {
        mistakes.push(`Extra: "${userWords[i]}"`);
        wordResults.push({ word: userWords[i], isCorrect: false });
      } else if (userWords[i].replace(/[.,?]/g, '') !== originalWords[i].replace(/[.,?]/g, '')) {
        mistakes.push(`Expected: "${originalWords[i]}", Got: "${userWords[i]}"`);
        wordResults.push({ word: userWords[i], isCorrect: false, expected: originalWords[i] });
      } else {
        correctWords++;
        wordResults.push({ word: userWords[i], isCorrect: true });
      }
    }

    const accuracy = originalWords.length > 0 ? (correctWords / originalWords.length) * 100 : 0;
    return {
      accuracy,
      correctWords,
      totalWords: originalWords.length,
      mistakes,
      wordResults
    };
  };

  const cleanupAudio = (audioId: string) => {
    if (audioUrls[audioId]) {
      URL.revokeObjectURL(audioUrls[audioId]);
      setAudioUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[audioId];
        return newUrls;
      });
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.onerror = null;
      audioRef.current.onended = null;
    }
    setPlayingId(null);
    setIsAudioError(false);
  };

  useEffect(() => {
    return () => {
      setIsAudioError(false);
      cleanupAudio(playingId || '');
    };
  }, []);

  const playAudioFromBlob = (blob: Blob, audioId: string) => {
    if (!blob || !(blob instanceof Blob)) {
      message.error('Invalid audio data');
      return;
    }

    if (blob.size === 0) {
      message.error('Audio data is empty');
      return;
    }

    if (playingId && playingId !== audioId) {
      cleanupAudio(playingId);
    }

    try {
      if (!blob.type.startsWith('audio/')) {
        blob = new Blob([blob], { type: 'audio/webm' });
      }

      const audioUrl = URL.createObjectURL(blob);
      if (!audioUrl) {
        message.error('Failed to create audio URL');
        return;
      }

      setAudioUrls(prev => ({ ...prev, [audioId]: audioUrl }));

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrl;
      audioRef.current.onerror = null;
      audioRef.current.onended = null;

      audioRef.current.onerror = () => {
        if (!isAudioError) {
          setIsAudioError(true);
          message.error('Failed to play audio');
          cleanupAudio(audioId);
        }
      };

      audioRef.current.onended = () => {
        cleanupAudio(audioId);
      };

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          if (!isAudioError) {
            setIsAudioError(true);
            message.error('Failed to play audio');
            cleanupAudio(audioId);
          }
        });
      }

      setPlayingId(audioId);
    } catch (error) {
      console.error('Error creating audio element:', error);
      if (!isAudioError) {
        setIsAudioError(true);
        message.error('Failed to create audio element');
      }
    }
  };

  const handlePlayAudio = async (audioPath: string, audioId: string) => {
    if (!audioPath) {
      message.error('No audio file available');
      return;
    }

    if (playingId === audioId) {
      cleanupAudio(audioId);
      return;
    }

    setIsAudioError(false);
    const cachedBlob = audioBlobs[audioId];
    if (cachedBlob) {
      playAudioFromBlob(cachedBlob, audioId);
    } else {
      setCurrentAudioPath(audioPath);
    }
  };

  const saveUserAnswer = async (questionId: number, transcript: string, score: number, audioBlob: Blob, sample: 1 | 2) => {
    const formData = new FormData();
    const requestDto = {
      speakingPracticeId: questionId,
      userId: 1,
      speakingText: transcript,
      speakingScore: Math.round(score),
      sampleAnswerNumber: sample,
    };
    formData.append('requestDto', new Blob([JSON.stringify(requestDto)], { type: 'application/json' }));
    formData.append('answerFile', audioBlob, 'answer.webm');

    try {
      await saveUserAnswerMutation(formData).unwrap();
      message.success('Your answer has been saved!');
    } catch (error) {
      message.error('Failed to save your answer.');
    }
  };

  const startRecording = async (sample: 1 | 2) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    try {
      if (isRecording) {
        message.warning('A recording is already in progress. Please stop it first.');
        return;
      }
      resetRecording();
      setCurrentSample(sample);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const fullTranscript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setTranscript(fullTranscript);
        };

        recognitionRef.current.start();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length === 0) {
          console.error('No audio data recorded');
          return;
        }

        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
          if (audioBlob.size === 0) {
            console.error('Created audio blob is empty');
            return;
          }

          const audioUrl = URL.createObjectURL(audioBlob);
          if (!audioUrl) {
            console.error('Failed to create object URL');
            return;
          }

          setRecordedAudio(audioUrl);
          
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }

          if (transcript && score && currentSample !== null) {
            await saveUserAnswer(currentQuestion.id, transcript, score.accuracy, audioBlob, currentSample);
          }
        } catch (error) {
          console.error('Error processing recorded audio:', error);
          message.error('Failed to process recorded audio');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      message.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const togglePlayback = () => {
    if (recordedAudioRef.current) {
      if (isPlaying) {
        recordedAudioRef.current.pause();
      } else {
        recordedAudioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetRecording = () => {
    setTranscript('');
    setRecordedAudio(null);
    setScore(null);
    setCurrentSample(null);
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      setIsPlaying(false);
    }
    if (playingId) {
      cleanupAudio(playingId);
    }
  };

  const nextQuestion = () => {
    const questionsList = Array.isArray(questions) 
      ? questions 
      : questions?.data 
      ? questions.data 
      : [];
    
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      resetRecording();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
      resetRecording();
    }
  };

  const renderColoredText = () => {
    if (!score) return null;

    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Your Text with Highlights:</h3>
        <div className="space-y-2">
          {score.wordResults.map((result, index) => (
            <span
              key={index}
              className={`inline-block px-1 ${
                result.isCorrect
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              } rounded`}
              title={result.expected ? `Expected: ${result.expected}` : ''}
            >
              {result.word}
            </span>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <span className="inline-block w-3 h-3 bg-green-100 rounded mr-1"></span>
          Correct
          <span className="inline-block w-3 h-3 bg-red-100 rounded ml-4 mr-1"></span>
          Incorrect
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading questions...</p>
          </div>
        </div>
      </Container>
    );
  }

  const questionsList = Array.isArray(questions) 
    ? questions 
    : questions?.data 
    ? questions.data 
    : [];

  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    return (
      <Container>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Title level={2}>No questions available</Title>
            <Button onClick={() => router.push('/ielts-categories')} className="mt-4">
              Back to Categories
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="text-gray-800">IELTS Speaking Practice</Title>
              <Text className="text-gray-600">
                Question {currentQuestionIndex + 1} of {questionsList.length}
              </Text>
            </div>
            <Button onClick={() => router.push('/ielts-categories')} icon={<LeftOutlined />}>
              Back to Categories
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress 
              percent={((currentQuestionIndex + 1) / questionsList.length) * 100} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              showInfo={false}
            />
          </div>

          {/* Flashcard */}
          <div className="flex justify-center mb-8">
            <Card 
              className="w-full max-w-3xl shadow-2xl border-0"
              style={{ 
                minHeight: '500px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <div className="text-center h-full flex flex-col justify-center">
                {/* Question Side */}
                {!showAnswer ? (
                  <div className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <Button
                        type="primary"
                        size="large"
                        icon={playingId === `question-${currentQuestion.id}` ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        onClick={() => handlePlayAudio(currentQuestion.questionAudioPath, `question-${currentQuestion.id}`)}
                        disabled={!currentQuestion.questionAudioPath}
                        className="bg-white text-blue-600 border-white hover:bg-gray-100"
                      >
                        {playingId === `question-${currentQuestion.id}` ? 'Pause Question' : 'Play Question'}
                      </Button>
                    </div>
                    
                    <Title level={3} className="text-white mb-6">
                      {currentQuestion.question}
                    </Title>
                    
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => setShowAnswer(true)}
                      className="bg-white text-blue-600 border-white hover:bg-gray-100 px-8 py-4 h-auto text-lg"
                    >
                      Show Sample Answers
                    </Button>
                  </div>
                ) : (
                  /* Answer Side */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <Title level={3} className="text-white mb-0">Sample Answers</Title>
                      <Button 
                        type="primary" 
                        onClick={() => setShowAnswer(false)}
                        className="bg-white text-blue-600 border-white hover:bg-gray-100"
                      >
                        Hide Answers
                      </Button>
                    </div>

                    <Row gutter={[16, 16]}>
                      {/* Sample Answer 1 */}
                      <Col xs={24} lg={12}>
                        <Card className="bg-white bg-opacity-20 border-white border-opacity-30">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Text strong className="text-white">Sample Answer 1</Text>
                              <div className="flex items-center gap-2">
                                <Progress
                                  type="circle"
                                  percent={currentQuestion.score1 || 0}
                                  format={(percent) => `${percent?.toFixed(1)}%`}
                                  width={50}
                                  strokeColor="#87d068"
                                />
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={playingId === `answer1-${currentQuestion.id}` ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                  onClick={() => handlePlayAudio(currentQuestion.answer1AudioPath, `answer1-${currentQuestion.id}`)}
                                  disabled={!currentQuestion.answer1AudioPath}
                                  className="bg-white text-blue-600 border-white hover:bg-gray-100"
                                >
                                  {playingId === `answer1-${currentQuestion.id}` ? 'Pause' : 'Play'}
                                </Button>
                              </div>
                            </div>
                            <Text className="text-white">{currentQuestion.sampleAnswer1}</Text>
                            
                            {/* Recording Section for Answer 1 */}
                            <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                              <div className="flex items-center justify-center space-x-4 mb-4">
                                <button
                                  onClick={() => (isRecording && currentSample === 1) ? stopRecording() : startRecording(1)}
                                  className={`p-3 rounded-full ${
                                    (isRecording && currentSample === 1)
                                      ? 'bg-red-500 hover:bg-red-600' 
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  } text-white transition-colors duration-200`}
                                  disabled={isRecording && currentSample !== 1}
                                >
                                  <BiMicrophone size={24} />
                                </button>

                                {recordedAudio && currentSample === 1 && (
                                  <>
                                    <button
                                      onClick={togglePlayback}
                                      className={`p-3 rounded-full ${
                                        isPlaying 
                                          ? 'bg-red-500 hover:bg-red-600' 
                                          : 'bg-green-500 hover:bg-green-600'
                                      } text-white transition-colors duration-200`}
                                    >
                                      {isPlaying ? <BiPause size={24} /> : <BiPlay size={24} />}
                                    </button>

                                    <button
                                      onClick={resetRecording}
                                      className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                                    >
                                      <BiRefresh size={24} />
                                    </button>
                                  </>
                                )}
                              </div>

                              {recordedAudio && currentSample === 1 && (
                                <audio 
                                  ref={recordedAudioRef}
                                  src={recordedAudio}
                                  className="hidden"
                                  onEnded={() => setIsPlaying(false)}
                                />
                              )}

                              {(isRecording || (transcript && currentSample === 1)) && (
                                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                  <Text className="text-white">{transcript || '...'}</Text>
                                </div>
                              )}

                              {score && currentSample === 1 && (
                                <div className="mt-4 space-y-3">
                                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                    <Text className="text-white">
                                      Accuracy: <span className="font-semibold">{score.accuracy.toFixed(1)}%</span>
                                    </Text>
                                    <br />
                                    <Text className="text-white">
                                      Correct Words: <span className="font-semibold">{score.correctWords}</span> / {score.totalWords}
                                    </Text>
                                  </div>
                                  {renderColoredText()}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Col>

                      {/* Sample Answer 2 */}
                      <Col xs={24} lg={12}>
                        <Card className="bg-white bg-opacity-20 border-white border-opacity-30">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Text strong className="text-white">Sample Answer 2</Text>
                              <div className="flex items-center gap-2">
                                <Progress
                                  type="circle"
                                  percent={currentQuestion.score2 || 0}
                                  format={(percent) => `${percent?.toFixed(1)}%`}
                                  width={50}
                                  strokeColor="#87d068"
                                />
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={playingId === `answer2-${currentQuestion.id}` ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                  onClick={() => handlePlayAudio(currentQuestion.answer2AudioPath, `answer2-${currentQuestion.id}`)}
                                  disabled={!currentQuestion.answer2AudioPath}
                                  className="bg-white text-blue-600 border-white hover:bg-gray-100"
                                >
                                  {playingId === `answer2-${currentQuestion.id}` ? 'Pause' : 'Play'}
                                </Button>
                              </div>
                            </div>
                            <Text className="text-white">{currentQuestion.sampleAnswer2}</Text>
                            
                            {/* Recording Section for Answer 2 */}
                            <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                              <div className="flex items-center justify-center space-x-4 mb-4">
                                <button
                                  onClick={() => (isRecording && currentSample === 2) ? stopRecording() : startRecording(2)}
                                  className={`p-3 rounded-full ${
                                    (isRecording && currentSample === 2)
                                      ? 'bg-red-500 hover:bg-red-600' 
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  } text-white transition-colors duration-200`}
                                  disabled={isRecording && currentSample !== 2}
                                >
                                  <BiMicrophone size={24} />
                                </button>

                                {recordedAudio && currentSample === 2 && (
                                  <>
                                    <button
                                      onClick={togglePlayback}
                                      className={`p-3 rounded-full ${
                                        isPlaying 
                                          ? 'bg-red-500 hover:bg-red-600' 
                                          : 'bg-green-500 hover:bg-green-600'
                                      } text-white transition-colors duration-200`}
                                    >
                                      {isPlaying ? <BiPause size={24} /> : <BiPlay size={24} />}
                                    </button>

                                    <button
                                      onClick={resetRecording}
                                      className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                                    >
                                      <BiRefresh size={24} />
                                    </button>
                                  </>
                                )}
                              </div>

                              {recordedAudio && currentSample === 2 && (
                                <audio 
                                  ref={recordedAudioRef}
                                  src={recordedAudio}
                                  className="hidden"
                                  onEnded={() => setIsPlaying(false)}
                                />
                              )}

                              {(isRecording || (transcript && currentSample === 2)) && (
                                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                  <Text className="text-white">{transcript || '...'}</Text>
                                </div>
                              )}

                              {score && currentSample === 2 && (
                                <div className="mt-4 space-y-3">
                                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                    <Text className="text-white">
                                      Accuracy: <span className="font-semibold">{score.accuracy.toFixed(1)}%</span>
                                    </Text>
                                    <br />
                                    <Text className="text-white">
                                      Correct Words: <span className="font-semibold">{score.correctWords}</span> / {score.totalWords}
                                    </Text>
                                  </div>
                                  {renderColoredText()}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              icon={<LeftOutlined />}
              size="large"
            >
              Previous
            </Button>
            
            <div className="text-center">
              <Text className="text-lg font-semibold text-gray-700">
                {currentQuestionIndex + 1} / {questionsList.length}
              </Text>
            </div>
            
            <Button 
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questionsList.length - 1}
              icon={<RightOutlined />}
              size="large"
              type="primary"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TextQuestionsPage;
