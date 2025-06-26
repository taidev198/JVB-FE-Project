export interface ListeningPracticeCustomDto {
  id: number;
  question: string;
  answer: string;
}

export interface ListeningPracticeResponseDto {
  id: number;
  title: string;
  url: string;
  practiceId: number
  sub: string;
  category: string;
  practices: ListeningPracticeCustomDto[];
}

export interface SubtitleSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isHighlighted?: boolean;
}

export interface VideoPlayerState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
} 