import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { SubtitleSegment } from '@/types/listeningPractice';

const { Text, Paragraph } = Typography;

interface SubtitleDisplayProps {
  subtitle: string;
  currentTime: number;
  onSegmentClick: (startTime: number) => void;
  className?: string;
}

const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  subtitle,
  currentTime,
  onSegmentClick,
  className = '',
}) => {
  const [segments, setSegments] = useState<SubtitleSegment[]>([]);
  const [highlightedSegment, setHighlightedSegment] = useState<string | null>(null);

  // Parse subtitle text into segments with timing
  useEffect(() => {
    if (subtitle) {
      const parsedSegments = parseSubtitle(subtitle);
      setSegments(parsedSegments);
    }
  }, [subtitle]);

  // Update highlighted segment based on current time
  useEffect(() => {
    const currentSegment = segments.find(
      segment => currentTime >= segment.startTime && currentTime <= segment.endTime
    );
    setHighlightedSegment(currentSegment?.id || null);
  }, [currentTime, segments]);

  const parseSubtitle = (subtitleText: string): SubtitleSegment[] => {
    // This is a simple parser - you might need to adjust based on your subtitle format
    const lines = subtitleText.split('\n').filter(line => line.trim());
    const segments: SubtitleSegment[] = [];
    
    // Simple parsing - assumes format like: "00:00:00,000 --> 00:00:05,000\nText content"
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        const timeLine = lines[i];
        const textLine = lines[i + 1];
        
        const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
        
        if (timeMatch) {
          const startTime = parseTimeToSeconds(timeMatch.slice(1, 5));
          const endTime = parseTimeToSeconds(timeMatch.slice(5, 9));
          
          segments.push({
            id: `segment-${i}`,
            text: textLine.trim(),
            startTime,
            endTime,
          });
        }
      }
    }
    
    // If no timing found, split by sentences and assign estimated timing
    if (segments.length === 0) {
      const sentences = subtitleText.split(/[.!?]+/).filter(s => s.trim());
      const estimatedDuration = 3; // 3 seconds per sentence
      
      sentences.forEach((sentence, index) => {
        segments.push({
          id: `segment-${index}`,
          text: sentence.trim(),
          startTime: index * estimatedDuration,
          endTime: (index + 1) * estimatedDuration,
        });
      });
    }
    
    return segments;
  };

  const parseTimeToSeconds = (timeParts: string[]): number => {
    const [hours, minutes, seconds, milliseconds] = timeParts.map(Number);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  };

  const handleSegmentClick = (segment: SubtitleSegment) => {
    onSegmentClick(segment.startTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      title="Subtitles" 
      className={`subtitle-display ${className}`}
      bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }}
    >
      {segments.length > 0 ? (
        <div className="space-y-2">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                highlightedSegment === segment.id
                  ? 'bg-blue-100 border-l-4 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => handleSegmentClick(segment)}
            >
              <div className="flex items-start justify-between">
                <Paragraph className="mb-1 text-sm">
                  {segment.text}
                </Paragraph>
                <Text className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                </Text>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Text type="secondary">No subtitle segments found</Text>
        </div>
      )}
    </Card>
  );
};

export default SubtitleDisplay; 