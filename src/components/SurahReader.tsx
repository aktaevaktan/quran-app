'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import VerseCard from './VerseCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getFormattedSurah, type FormattedSurah } from '@/lib/quran-api';
import { allSurahs } from '@/lib/surah-list';

interface SurahReaderProps {
  surahNumber: number;
  onBack: () => void;
}

export default function SurahReader({ surahNumber, onBack }: SurahReaderProps) {
  const [surah, setSurah] = useState<FormattedSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surahInfo = allSurahs.find(s => s.id === surahNumber);

  useEffect(() => {
    async function loadSurah() {
      setLoading(true);
      setError(null);
      try {
        const data = await getFormattedSurah(surahNumber);
        setSurah(data);
      } catch (err) {
        setError('Ошибка загрузки суры');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSurah();
  }, [surahNumber]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад к списку сур</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p
            className="text-4xl text-white mb-2 font-arabic"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            {surahInfo?.nameArabic}
          </p>
          <h1 className="text-2xl font-bold text-white mb-2">
            {surahInfo?.nameRussian}
          </h1>
          <p className="text-emerald-100">
            Сура {surahNumber} • {surahInfo?.versesCount} аятов •{' '}
            {surahInfo?.revelationType === 'Meccan' ? 'Мекканская' : 'Мединская'}
          </p>
        </motion.div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
          <p className="text-gray-600">Загрузка суры...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && surah && (
        <>
          {/* Bismillah (except for Surah 9) */}
          {surahNumber !== 9 && surahNumber !== 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-6 bg-emerald-50 border-b border-emerald-100"
            >
              <p
                className="text-2xl text-emerald-800 font-arabic"
                style={{ fontFamily: "'Amiri', serif" }}
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-emerald-600 mt-2 text-sm">
                Во имя Аллаха, Милостивого, Милосердного
              </p>
            </motion.div>
          )}

          {/* Verses */}
          <div className="p-4 space-y-4">
            {surah.verses.map((verse, index) => (
              <motion.div
                key={verse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.1 + index * 0.03, 1) }}
              >
                <VerseCard verse={verse} surahNumber={surahNumber} />
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {surah.verses.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>Не удалось загрузить аяты. Проверьте интернет-соединение.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
