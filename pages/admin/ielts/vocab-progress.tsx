import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserVocabPracticeQuery } from '@/services/portalHomeApi';

const TOTAL_DAYS = 60;

export default function VocabProgressPage() {
  const router = useRouter();
  const userId = useSelector((state: any) => state.user.id);
  const { data: userProgress = [], isLoading } = useGetUserVocabPracticeQuery(userId, { skip: !userId });
  const [clickedDay, setClickedDay] = useState<number | null>(null);

  // Map day to progress percentage
  const progressMap: Record<number, number> = {};
  userProgress.forEach((item: any) => {
    if (item.day && item.totalCount) {
      progressMap[item.day] = Math.round((item.correctCount / item.totalCount) * 100);
    }
  });

  const handleDayClick = (day: number) => {
    setClickedDay(day);
    setTimeout(() => setClickedDay(null), 400);
    router.push(`/admin/ielts/flashcard-game?day=${day}`);
  };

  return (
    <div className="flex flex-wrap max-w-2xl mx-auto py-10 gap-4 justify-center">
      {[...Array(TOTAL_DAYS)].map((_, i) => {
        const day = i + 1;
        const percent = progressMap[day] || 0;
        const isClicked = clickedDay === day;
        let bgColor = 'bg-blue-200 text-blue-900 hover:bg-blue-400';
        if (percent === 100) bgColor = 'bg-green-400 text-white';
        else if (percent > 0) bgColor = 'bg-yellow-300 text-yellow-900 hover:bg-yellow-400';
        return (
          <button
            key={day}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-md transition-all duration-300 relative ${bgColor} ${isClicked ? 'animate-bounce' : ''}`}
            style={{ outline: percent === 100 ? '2px solid #22c55e' : undefined }}
            onClick={() => handleDayClick(day)}
          >
            <span className="flex flex-col items-center justify-center w-full h-full">
              <span>{day}</span>
              {percent > 0 && (
                <span className="text-xs font-semibold mt-1">{percent}%</span>
              )}
            </span>
            {/* Animated ring for completed days */}
            {percent === 100 && (
              <span className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping"></span>
            )}
          </button>
        );
      })}
    </div>
  );
} 