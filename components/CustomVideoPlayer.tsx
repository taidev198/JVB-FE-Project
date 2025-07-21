import React, { useRef, useState, useEffect } from 'react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const speedOptions = [0.5, 1, 1.25, 1.5, 2];

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrent(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = speed;
  }, [speed]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setCurrent(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = Number(e.target.value);
    video.volume = vol;
    setVolume(vol);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!fullscreen) {
      if (video.requestFullscreen) video.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    let newTime = video.currentTime + seconds;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    video.currentTime = newTime;
    setCurrent(newTime);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black rounded-lg shadow-lg p-4">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full rounded"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        controls={false}
      />
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => skip(-5)} className="text-white" title="Back 5s">⏪ 5s</button>
        <button onClick={togglePlay} className="text-white">
          {playing ? '⏸' : '▶️'}
        </button>
        <button onClick={() => skip(5)} className="text-white" title="Forward 5s">5s ⏩</button>
        <span className="text-xs text-gray-200">{formatTime(current)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={current}
          onChange={handleSeek}
          className="flex-1 accent-blue-500"
        />
        <span className="text-xs text-gray-200">{formatTime(duration)}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolume}
          className="w-20 accent-blue-500"
        />
        <select
          value={speed}
          onChange={handleSpeedChange}
          className="ml-2 px-1 py-0.5 rounded text-xs bg-gray-800 text-white border border-gray-600"
        >
          {speedOptions.map((s) => (
            <option key={s} value={s}>{s}x</option>
          ))}
        </select>
        <button onClick={handleFullscreen} className="text-white">
          {fullscreen ? '🡼' : '⛶'}
        </button>
      </div>
    </div>
  );
};

export default CustomVideoPlayer; 