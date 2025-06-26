import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Spin, Alert, Space } from 'antd';
import VideoPlayer from './VideoPlayer';
import SubtitleDisplay from './SubtitleDisplay';
import PracticeQuestions from './PracticeQuestions';
import { ListeningPracticeResponseDto } from '@/types/listeningPractice';

const { Title, Text } = Typography;

interface ListeningPracticeProps {
  practiceData: ListeningPracticeResponseDto;
  className?: string;
}

const ListeningPractice: React.FC<ListeningPracticeProps> = ({
  practiceData,
  className = '',
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekToTime, setSeekToTime] = useState<number | undefined>(undefined);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration);
  };

  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleSegmentClick = (startTime: number) => {
    setSeekToTime(startTime);
    setIsPlaying(true);
  };

  // Reset seekToTime after it's been applied
  useEffect(() => {
    if (seekToTime !== undefined) {
      const timer = setTimeout(() => {
        setSeekToTime(undefined);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [seekToTime]);

  if (!practiceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`listening-practice ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="text-center mb-2">
            Listening Practice
          </Title>
          <Text className="text-center block text-gray-600">
            Category: {practiceData.category}
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Video Player */}
          <Col xs={24} lg={16}>
            <Card title="Video Player" className="h-fit">
              <VideoPlayer
                url={practiceData.url}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
                onPlayStateChange={handlePlayStateChange}
                seekTo={seekToTime}
                isPlaying={isPlaying}
                className="w-full"
              />
            </Card>
          </Col>

          {/* Subtitles */}
          <Col xs={24} lg={8}>
            <SubtitleDisplay
              subtitle={practiceData.sub}
              currentTime={currentTime}
              onSegmentClick={handleSegmentClick}
              className="h-fit"
            />
          </Col>
        </Row>

        {/* Practice Questions */}
        <Row className="mt-8">
          <Col span={24}>
            <PracticeQuestions
              practices={practiceData.practices}
              className="w-full"
            />
          </Col>
        </Row>

        {/* Instructions */}
        <Row className="mt-6">
          <Col span={24}>
            <Alert
              message="How to use this practice session:"
              description={
                <ul className="list-disc list-inside space-y-1">
                  <li>Watch the video and read the subtitles below</li>
                  <li>Click on any subtitle segment to jump to that part of the video</li>
                  <li>Answer the practice questions at the bottom to test your comprehension</li>
                  <li>Use the "Check Answers" button to see your score</li>
                </ul>
              }
              type="info"
              showIcon
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ListeningPractice; 