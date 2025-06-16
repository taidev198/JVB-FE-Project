import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Button, Space, message, Collapse } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useGetTextQuestionsQuery, useGetAudioFileQuery } from '@/services/portalHomeApi';
import { BiMicrophone, BiPlay, BiPause, BiRefresh } from 'react-icons/bi';
import Container from '@/components/Container';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface TextQuestion {
  id: number;
  question: string;
  sampleAnswer1: string;
  sampleAnswer2: string;
  questionAudioPath: string;
  answer1AudioPath: string;
  answer2AudioPath: string;
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
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioBlobs, setAudioBlobs] = useState<{ [key: string]: Blob }>({});
  const [currentAudioPath, setCurrentAudioPath] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({});
  const [isAudioError, setIsAudioError] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedAudioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: questions, isLoading, error } = useGetTextQuestionsQuery();
  const { data: audioBlob, error: audioError } = useGetAudioFileQuery(currentAudioPath || '', {
    skip: !currentAudioPath,
  });

  useEffect(() => {
    if (error) {
      message.error('Failed to fetch questions');
    }
    console.log('API Response:', questions);
  }, [error, questions]);

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
    if (transcript && currentQuestionId !== null) {
      const result = calculateScore(transcript, currentQuestionId);
      setScore(result);
    }
  }, [transcript, currentQuestionId]);

  const calculateScore = (userText: string, questionId: number): ScoreResult => {
    const questionsList = Array.isArray(questions) 
      ? questions 
      : questions?.data 
      ? questions.data 
      : [];

    const currentQuestion = questionsList.find(q => q.id === questionId);
    if (!currentQuestion) {
      return {
        accuracy: 0,
        correctWords: 0,
        totalWords: 0,
        mistakes: ['No question found'],
        wordResults: []
      };
    }

    const originalWords = currentQuestion.sampleAnswer1.toLowerCase().split(/\s+/) || [];
    const userWords = userText.toLowerCase().split(/\s+/);
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
      } else if (userWords[i] !== originalWords[i]) {
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
      console.log('Fetching audio:', audioPath);
      setCurrentAudioPath(audioPath);
    }
  };

  const startRecording = async (questionId: number) => {
    try {
      setCurrentQuestionId(questionId);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setTranscript(transcript);
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
    setCurrentQuestionId(null);
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      setIsPlaying(false);
    }
    if (playingId) {
      cleanupAudio(playingId);
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
    return <div>Loading...</div>;
  }

  const questionsList = Array.isArray(questions) 
    ? questions 
    : questions?.data 
    ? questions.data 
    : [];

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Title level={2} className="text-center mb-8">IELTS Speaking Questions</Title>
          
          {questionsList.length === 0 ? (
            <div>No questions available</div>
          ) : (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {questionsList.map((question) => (
                <Card key={question.id} className="w-full">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div className="flex items-center justify-between">
                      <Text strong>{question.question}</Text>
                      <Button
                        type="primary"
                        icon={playingId === `question-${question.id}` ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        onClick={() => handlePlayAudio(question.questionAudioPath, `question-${question.id}`)}
                        disabled={!question.questionAudioPath}
                      >
                        {playingId === `question-${question.id}` ? 'Pause Question' : 'Play Question'}
                      </Button>
                    </div>

                    <Collapse defaultActiveKey={[]}>
                      <Panel header="Sample Answer 1" key="1">
                        <div className="flex items-center justify-between mb-2">
                          <Text>{question.sampleAnswer1}</Text>
                          <Button
                            type="primary"
                            icon={playingId === `answer1-${question.id}` ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={() => handlePlayAudio(question.answer1AudioPath, `answer1-${question.id}`)}
                            disabled={!question.answer1AudioPath}
                          >
                            {playingId === `answer1-${question.id}` ? 'Pause Answer' : 'Play Answer'}
                          </Button>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => isRecording ? stopRecording() : startRecording(question.id)}
                                className={`p-4 rounded-full ${
                                  isRecording 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                                } text-white transition-colors duration-200`}
                              >
                                <BiMicrophone size={32} />
                              </button>

                              {recordedAudio && currentQuestionId === question.id && (
                                <>
                                  <button
                                    onClick={togglePlayback}
                                    className={`p-4 rounded-full ${
                                      isPlaying 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-green-500 hover:bg-green-600'
                                    } text-white transition-colors duration-200`}
                                  >
                                    {isPlaying ? <BiPause size={32} /> : <BiPlay size={32} />}
                                  </button>

                                  <button
                                    onClick={resetRecording}
                                    className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                                  >
                                    <BiRefresh size={32} />
                                  </button>
                                </>
                              )}
                            </div>

                            {recordedAudio && currentQuestionId === question.id && (
                              <audio 
                                ref={recordedAudioRef}
                                src={recordedAudio}
                                className="hidden"
                                onEnded={() => setIsPlaying(false)}
                              />
                            )}

                            <div className="flex justify-between items-center mb-2">
                              <h2 className="text-xl font-semibold">Your Answer:</h2>
                              <button
                                onClick={() => setShowOriginal(!showOriginal)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                {showOriginal ? 'Hide Original' : 'Show Original'}
                              </button>
                            </div>

                            {recordedAudio && currentQuestionId === question.id && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-700">{transcript}</p>
                                </div>
                              </div>
                            )}

                            {score && currentQuestionId === question.id && (
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2">Score:</h3>
                                  <div className="space-y-2">
                                    <p className="text-gray-700">
                                      Accuracy: <span className="font-semibold">{score.accuracy.toFixed(1)}%</span>
                                    </p>
                                    <p className="text-gray-700">
                                      Correct Words: <span className="font-semibold">{score.correctWords}</span> / {score.totalWords}
                                    </p>
                                    {score.mistakes.length > 0 && (
                                      <div>
                                        <p className="text-gray-700 font-semibold mb-1">Mistakes:</p>
                                        <ul className="list-disc list-inside text-gray-600">
                                          {score.mistakes.map((mistake, index) => (
                                            <li key={index}>{mistake}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {renderColoredText()}
                              </div>
                            )}
                          </div>
                        </div>
                      </Panel>
                      <Panel header="Sample Answer 2" key="2">
                        <div className="flex items-center justify-between mb-2">
                          <Text>{question.sampleAnswer2}</Text>
                          <Button
                            type="primary"
                            icon={playingId === `answer2-${question.id}` ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={() => handlePlayAudio(question.answer2AudioPath, `answer2-${question.id}`)}
                            disabled={!question.answer2AudioPath}
                          >
                            {playingId === `answer2-${question.id}` ? 'Pause Answer' : 'Play Answer'}
                          </Button>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => isRecording ? stopRecording() : startRecording(question.id)}
                                className={`p-4 rounded-full ${
                                  isRecording 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                                } text-white transition-colors duration-200`}
                              >
                                <BiMicrophone size={32} />
                              </button>

                              {recordedAudio && currentQuestionId === question.id && (
                                <>
                                  <button
                                    onClick={togglePlayback}
                                    className={`p-4 rounded-full ${
                                      isPlaying 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-green-500 hover:bg-green-600'
                                    } text-white transition-colors duration-200`}
                                  >
                                    {isPlaying ? <BiPause size={32} /> : <BiPlay size={32} />}
                                  </button>

                                  <button
                                    onClick={resetRecording}
                                    className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                                  >
                                    <BiRefresh size={32} />
                                  </button>
                                </>
                              )}
                            </div>

                            {recordedAudio && currentQuestionId === question.id && (
                              <audio 
                                ref={recordedAudioRef}
                                src={recordedAudio}
                                className="hidden"
                                onEnded={() => setIsPlaying(false)}
                              />
                            )}

                            <div className="flex justify-between items-center mb-2">
                              <h2 className="text-xl font-semibold">Your Answer:</h2>
                              <button
                                onClick={() => setShowOriginal(!showOriginal)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                {showOriginal ? 'Hide Original' : 'Show Original'}
                              </button>
                            </div>

                            {recordedAudio && currentQuestionId === question.id && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-700">{transcript}</p>
                                </div>
                              </div>
                            )}

                            {score && currentQuestionId === question.id && (
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2">Score:</h3>
                                  <div className="space-y-2">
                                    <p className="text-gray-700">
                                      Accuracy: <span className="font-semibold">{score.accuracy.toFixed(1)}%</span>
                                    </p>
                                    <p className="text-gray-700">
                                      Correct Words: <span className="font-semibold">{score.correctWords}</span> / {score.totalWords}
                                    </p>
                                    {score.mistakes.length > 0 && (
                                      <div>
                                        <p className="text-gray-700 font-semibold mb-1">Mistakes:</p>
                                        <ul className="list-disc list-inside text-gray-600">
                                          {score.mistakes.map((mistake, index) => (
                                            <li key={index}>{mistake}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {renderColoredText()}
                              </div>
                            )}
                          </div>
                        </div>
                      </Panel>
                    </Collapse>
                  </Space>
                </Card>
              ))}
            </Space>
          )}
        </div>
      </div>
    </Container>
  );
};

export default TextQuestionsPage; 