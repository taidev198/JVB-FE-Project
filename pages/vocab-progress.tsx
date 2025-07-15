import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const TOTAL_DAYS = 60;

export default function VocabProgressPage() {
  const router = useRouter();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [clickedDay, setClickedDay] = useState<number | null>(null);

  // Load completed days from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vocab_completed_days');
    if (stored) {
      setCompletedDays(JSON.parse(stored));
    }
  }, []);

  // Mark a day as completed (for demo, mark on click)
  const handleDayClick = (day: number) => {
    setClickedDay(day);
    setTimeout(() => setClickedDay(null), 400);
    if (!completedDays.includes(day)) {
      const updated = [...completedDays, day];
      setCompletedDays(updated);
      localStorage.setItem('vocab_completed_days', JSON.stringify(updated));
    }
    router.push(`/flashcard-game?day=${day}`);
  };

  return (
    <div className="flex flex-wrap max-w-2xl mx-auto py-10 gap-4 justify-center">
      {[...Array(TOTAL_DAYS)].map((_, i) => {
        const day = i + 1;
        const isCompleted = completedDays.includes(day);
        const isClicked = clickedDay === day;
        return (
          <button
            key={day}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-md transition-all duration-300 relative
              ${isCompleted ? 'bg-green-400 text-white' : 'bg-blue-200 text-blue-900 hover:bg-blue-400'}
              ${isClicked ? 'animate-bounce' : ''}
            `}
            style={{ outline: isCompleted ? '2px solid #22c55e' : undefined }}
            onClick={() => handleDayClick(day)}
          >
            {isCompleted ? (
              <span className="text-2xl animate-pulse">✔</span>
            ) : (
              day
            )}
            {/* Animated ring for completed days */}
            {isCompleted && (
              <span className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping"></span>
            )}
          </button>
        );
      })}
    </div>
  );
} 