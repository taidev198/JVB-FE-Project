import React from 'react';
import Container from '@/components/Container';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useGetIeltsVideoTutorialQuery } from '@/services/portalHomeApi';
import ReactPlayer from 'react-player';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';

export default function TutorialPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">IELTS Tutorial Video</h1>
      <CustomVideoPlayer src="http://localhost:8082/api/ielts/video-tutorial" />
    </div>
  );
} 