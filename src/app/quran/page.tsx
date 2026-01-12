'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import SurahList from '@/components/SurahList';
import SurahReader from '@/components/SurahReader';

export default function QuranPage() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!selectedSurah ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Священный Коран
              </h1>
              <p className="text-gray-600">
                Перевод смыслов на русский язык Эльмира Кулиева • 114 сур • 6236 аятов
              </p>
            </div>

            {/* Surah List */}
            <SurahList
              selectedSurah={selectedSurah}
              onSelectSurah={setSelectedSurah}
            />
          </motion.div>
        ) : (
          <SurahReader
            surahNumber={selectedSurah}
            onBack={() => setSelectedSurah(null)}
          />
        )}
      </div>
    </div>
  );
}
