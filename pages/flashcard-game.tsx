import React from 'react';
import dynamic from 'next/dynamic';
import Container from '@/components/Container';
import { Box, Typography } from '@mui/material';

const FlashcardGame = dynamic(() => import('@/components/FlashcardGame'), { ssr: false });

const sampleCards = [
  {
    ipaSymbol: '/kæt/',
    word: 'cat',
    audioUrl: 'https://www.oxfordlearnersdictionaries.com/media/english/us_pron/c/cat/cat__/cat__us_1.mp3',
    description: 'A small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws.',
    example: 'The cat sat on the mat.'
  },
  {
    ipaSymbol: '/dɒg/',
    word: 'dog',
    audioUrl: 'https://www.oxfordlearnersdictionaries.com/media/english/us_pron/d/dog/dog__/dog__us_1.mp3',
    description: 'A domesticated carnivorous mammal that typically has a long snout and an acute sense of smell.',
    example: 'The dog barked loudly.'
  },
  {
    ipaSymbol: '/bɜːd/',
    word: 'bird',
    audioUrl: 'https://www.oxfordlearnersdictionaries.com/media/english/us_pron/b/bir/bird_/bird__us_1.mp3',
    description: 'A warm-blooded egg-laying vertebrate animal distinguished by feathers, wings, and a beak.',
    example: 'The bird flew over the tree.'
  }
];

export default function FlashcardGamePage() {
  return (
    <Container>
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Flashcard Game
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Listen to the audio, guess the word, and learn its pronunciation and meaning!
        </Typography>
        <FlashcardGame cards={sampleCards} />
      </Box>
    </Container>
  );
}