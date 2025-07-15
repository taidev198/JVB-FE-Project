import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, TextField, Alert } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export interface FlashcardGameCard {
  ipaSymbol: string;
  word: string;
  audioUrl: string;
  description: string;
  example: string;
}

interface FlashcardGameProps {
  cards: FlashcardGameCard[];
  onAnswer?: (isCorrect: boolean) => void;
}

const correctSound = typeof window !== 'undefined' ? new Audio('/correct.mp3') : null;
const wrongSound = typeof window !== 'undefined' ? new Audio('/wrong.mp3') : null;

const FlashcardGame: React.FC<FlashcardGameProps> = ({ cards, onAnswer }) => {
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!cards || cards.length === 0) {
    return <Alert severity="info">No cards available.</Alert>;
  }

  const card = cards[0];

  const playAudio = () => {
    const audio = new Audio(card.audioUrl);
    audio.play();
  };

  const playCorrectSound = () => {
    if (correctSound) {
      correctSound.currentTime = 0;
      //correctSound.play();
    }
  };
  const playWrongSound = () => {
    if (wrongSound) {
      wrongSound.currentTime = 0;
      //wrongSound.play();
    }
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();    
    if (guess.trim().toLowerCase() === card.word.trim().toLowerCase()) {
      setFeedback('Correct!');
      setRevealed(true);
      //playCorrectSound();
    } else {
      setFeedback('Try again!');
      //playWrongSound();
    }
  };

  const handleNext = () => {
    setGuess('');
    setRevealed(false);
    setFeedback(null);
    if (onAnswer) onAnswer(false);
  };

  return (
    <Card sx={{ maxWidth: 500, margin: '24px auto', p: 2 }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<VolumeUpIcon />}
            onClick={playAudio}
            sx={{ mb: 2 }}
          >
            Listen
          </Button>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {card.description}
          </Typography>
        </Box>
        {!revealed ? (
          <form onSubmit={handleGuess}>
            <TextField
              label="Guess the word"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              autoFocus
            />
            <Button type="submit" variant="outlined" fullWidth sx={{ mb: 2 }}>
              Submit
            </Button>
            {feedback && <Alert severity={feedback === 'Correct!' ? 'success' : 'warning'} sx={{ mt: 1 }}>{feedback}</Alert>}
          </form>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>Correct! The word is:</Alert>
            <Typography variant="h3" sx={{ mb: 2 }}>{card.word}</Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>IPA: {card.ipaSymbol}</Typography>
            <Typography variant="body2" color="text.secondary">
              Example: {card.example}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 3 }}>
              Next
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardGame; 