import React, { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import { BiMicrophone, BiPlay, BiPause, BiRefresh } from 'react-icons/bi';

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
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

const DictationPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOriginalPlaying, setIsOriginalPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordedAudioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  const originalText = `Today is November 26th.
It snowed all day today.
The snow is beautiful.
The snow finally stopped.
My sister and I are excited.
My mom doesn't like the snow.
My mom has to shovel the driveway.
My sister and I get to play.
I put on my hat and mittens.
My mom puts on my scarf.
My mom zippers my jacket.
My sister puts on her hat and mittens.
My mom puts on her scarf.
My mom zippers her jacket.
My sister and I go outside.
We begin to make a snowman.
My mom starts to shovel the snow.
My sister and I make snow angels.
My sister and I throw snowballs.
It starts to snow again.
We go inside for hot chocolate.`;

  const calculateScore = (userText: string): ScoreResult => {
    const originalWords = originalText.toLowerCase().split(/\s+/);
    const userWords = userText.toLowerCase().split(/\s+/);
    const mistakes: string[] = [];
    let correctWords = 0;
    const wordResults: Array<{ word: string; isCorrect: boolean; expected?: string }> = [];

    // Compare each word
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

    const accuracy = (correctWords / originalWords.length) * 100;
    return {
      accuracy,
      correctWords,
      totalWords: originalWords.length,
      mistakes,
      wordResults
    };
  };

  useEffect(() => {
    if (typedText || transcript) {
      const userText = typedText || transcript;
      const result = calculateScore(userText);
      setScore(result);
    }
  }, [typedText, transcript]);

  const startRecording = async () => {
    try {
      // Initialize speech recognition
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
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Stop speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start playing the audio when recording starts
      if (audioRef.current) {
        audioRef.current.play();
        setIsOriginalPlaying(true);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop the audio when recording stops
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsOriginalPlaying(false);
      }

      // Stop speech recognition
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

  const toggleOriginalAudio = () => {
    if (audioRef.current) {
      if (isOriginalPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsOriginalPlaying(!isOriginalPlaying);
    }
  };

  const resetRecording = () => {
    setTranscript('');
    setRecordedAudio(null);
    setTypedText('');
    setScore(null);
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      setIsPlaying(false);
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

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">First Snowfall</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Original Audio Element (Needs Correct URL for playback) */}
              <audio 
                ref={audioRef}
                src="https://dailydictation.com/exercises/short-stories/1-first-snowfall.1/listen-and-type" // Replace this with the actual direct audio file URL (e.g., .mp3, .wav)
                className="hidden"
                onEnded={() => setIsOriginalPlaying(false)}
              />
              {recordedAudio && (
                <audio 
                  ref={recordedAudioRef}
                  src={recordedAudio}
                  className="hidden"
                  onEnded={() => setIsPlaying(false)}
                />
              )}
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-4 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors duration-200`}
                >
                  <BiMicrophone size={32} />
                </button>

                <button
                  onClick={toggleOriginalAudio}
                  className={`p-4 rounded-full ${
                    isOriginalPlaying 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white transition-colors duration-200`}
                >
                  {isOriginalPlaying ? <BiPause size={32} /> : <BiPlay size={32} />}
                </button>

                {recordedAudio && (
                  <button
                    onClick={resetRecording}
                    className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                  >
                    <BiRefresh size={32} />
                  </button>
                )}
              </div>
              
              <p className="text-lg text-gray-600">
                {isRecording ? 'Recording...' : 'Click the microphone to start recording'}
              </p>

              <div className="w-full mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Your Answer:</h2>
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {showOriginal ? 'Hide Original' : 'Show Original'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                  />

                  {recordedAudio && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-700">{transcript}</p>
                        <button
                          onClick={togglePlayback}
                          className="ml-4 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                        >
                          {isPlaying ? <BiPause size={24} /> : <BiPlay size={24} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {score && (
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

              {showOriginal && (
                <div className="w-full mt-8">
                  <h2 className="text-xl font-semibold mb-2">Original Text:</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {originalText.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DictationPage; 