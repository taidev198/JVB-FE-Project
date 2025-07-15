import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Container from '@/components/Container';
import dynamic from 'next/dynamic';
import { Box, Typography, CircularProgress, LinearProgress, Button } from '@mui/material';
import { useGetVocabCardsByDayQuery, useSaveUserVocabPracticeMutation } from '@/services/portalHomeApi';
import { useSelector } from 'react-redux';

const FlashcardGame = dynamic(() => import('@/components/FlashcardGame'), { ssr: false });

export default function FlashcardGamePage() {
  const router = useRouter();
  const { day } = router.query;
  const dayNumber = Number(day);
  const { data: cards = [], isLoading } = useGetVocabCardsByDayQuery(dayNumber, { skip: !dayNumber });
  const userId = useSelector((state: any) => state.user.id);
  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{word: string, isCorrect: boolean}[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [saveUserVocabPractice] = useSaveUserVocabPracticeMutation();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handler for answer submission
  const handleAnswer = (isCorrect: boolean, word: string) => {
    setUserAnswers(prev => [...prev, { word, isCorrect }]);
    if (current < cards.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowSummary(true);
    }
  };

  // Save result to backend
  const handleSaveResult = async () => {
    setSaving(true);
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const totalCount = cards.length;
    const answersJson = JSON.stringify(userAnswers);
    const score = totalCount > 0 ? correctCount / totalCount : 0;
    try {
      await saveUserVocabPractice({
        userId,
        day: dayNumber,
        correctCount,
        totalCount,
        answersJson,
        score
      }).unwrap();
      setSaveSuccess(true);
    } catch (e) {
      setSaveSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  // Progress bar value
  const progress = cards.length > 0 ? (current / cards.length) * 100 : 0;

  return (
    <Container>
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Flashcard Game - Day {day}
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Total words: {cards.length}
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : showSummary ? (
          <Box sx={{ maxWidth: 500, margin: '24px auto', p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>Result Summary</Typography>
            <Typography align="center" color="primary" gutterBottom>
              Correct: {userAnswers.filter(a => a.isCorrect).length} / {cards.length}
            </Typography>
            <ul className="mb-4">
              {userAnswers.map((ans, i) => (
                <li key={i} style={{ color: ans.isCorrect ? 'green' : 'red', fontWeight: 'bold' }}>
                  {cards[i]?.word}: {ans.isCorrect ? 'Correct' : 'Wrong'}
                </li>
              ))}
            </ul>
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveResult}
              disabled={saving || saveSuccess}
              fullWidth
              sx={{ mb: 2 }}
            >
              {saveSuccess ? 'Saved!' : saving ? 'Saving...' : 'Save Result'}
            </Button>
            {saveSuccess && (
              <Typography align="center" color="success.main">Result saved! You can view your progress on the progress page.</Typography>
            )}
            <Button variant="outlined" fullWidth onClick={() => router.push('/vocab-progress')}>Back to Progress</Button>
          </Box>
        ) : (
          <Box sx={{ maxWidth: 500, margin: '24px auto', p: 2 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
            {cards.length > 0 && (
              <FlashcardGame
                cards={[cards[current]]}
                onAnswer={(isCorrect: boolean) => handleAnswer(isCorrect, cards[current].word)}
              />
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}