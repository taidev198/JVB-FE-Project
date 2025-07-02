import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Button, Slider, Space, Typography } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { VideoPlayerState } from '@/types/listeningPractice';

const { Text } = Typography;

interface VideoPlayerProps {
  url: string;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  seekTo?: number;
  isPlaying?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange,
  seekTo,
  isPlaying: externalIsPlaying,
  className = '',
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [playerState, setPlayerState] = React.useState<VideoPlayerState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 1,
  });

  // Seek when seekTo changes
  useEffect(() => {
    if (seekTo !== undefined && playerRef.current) {
      playerRef.current.seekTo(seekTo, 'seconds');
    }
  }, [seekTo]);

  // Play/pause when externalIsPlaying changes
  useEffect(() => {
    setPlayerState(prev => ({ ...prev, isPlaying: !!externalIsPlaying }));
  }, [externalIsPlaying]);

  const handlePlayPause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    onPlayStateChange?.(!playerState.isPlaying);
  };

  const handleSeek = (value: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value, 'seconds');
      setPlayerState(prev => ({ ...prev, currentTime: value }));
    }
  };

  const handleVolumeChange = (value: number) => {
    setPlayerState(prev => ({ ...prev, volume: value }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls={false}
        playing={playerState.isPlaying}
        volume={playerState.volume}
        width="100%"
        height="400px"
        onProgress={({ playedSeconds }) => {
          setPlayerState(prev => ({ ...prev, currentTime: playedSeconds }));
          onTimeUpdate?.(playedSeconds);
        }}
        onDuration={duration => {
          setPlayerState(prev => ({ ...prev, duration }));
          onDurationChange?.(duration);
        }}
        onPlay={() => {
          setPlayerState(prev => ({ ...prev, isPlaying: true }));
          onPlayStateChange?.(true);
        }}
        onPause={() => {
          setPlayerState(prev => ({ ...prev, isPlaying: false }));
          onPlayStateChange?.(false);
        }}
      />
      <div className="p-4 bg-gray-900">
        <Space direction="vertical" size="small" className="w-full">
          {/* Progress Bar */}
          <Slider
            min={0}
            max={playerState.duration}
            value={playerState.currentTime}
            onChange={handleSeek}
            tooltip={{ formatter: formatTime }}
            className="w-full"
          />
          {/* Controls */}
          <div className="flex items-center justify-between">
            <Space>
              <Button
                type="text"
                icon={playerState.isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={handlePlayPause}
                className="text-white hover:text-blue-400"
              />
              <Text className="text-white text-sm">
                {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
              </Text>
            </Space>
            <Space>
              <SoundOutlined className="text-white" />
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={playerState.volume}
                onChange={handleVolumeChange}
                className="w-20"
              />
            </Space>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default VideoPlayer; 