import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface FlashcardProps {
  ipaSymbol: string;
  word: string;
  audioUrl: string;
  description: string;
  example: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ ipaSymbol, word, audioUrl, description, example }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const playAudio = () => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 400, 
        margin: '20px auto',
        cursor: 'pointer',
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <CardContent>
        <Box sx={{ textAlign: 'center', padding: 2 }}>
          {!isFlipped ? (
            <>
              <Typography variant="h2" component="div" sx={{ mb: 2 }}>
                {ipaSymbol}
              </Typography>
              <Button
                variant="contained"
                startIcon={<VolumeUpIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
              >
                Listen
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                {word}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Example: {example}
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Flashcard; 