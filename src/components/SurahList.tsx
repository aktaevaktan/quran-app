'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Book, ChevronRight, Search } from 'lucide-react';
import { allSurahs, type SurahInfo } from '@/lib/surah-list';

interface SurahListProps {
  selectedSurah: number | null;
  onSelectSurah: (surahNumber: number) => void;
}

export default function SurahList({
  selectedSurah,
  onSelectSurah,
}: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSurahs = allSurahs.filter(surah => 
    surah.nameRussian.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.nameArabic.includes(searchQuery) ||
    surah.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.id.toString() === searchQuery
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-emerald-600 p-4">
        <div className="flex items-center gap-3">
          <Book className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">Суры Корана</h2>
        </div>
        <p className="text-emerald-100 text-sm mt-1">
          114 сур • Перевод Кулиева
        </p>
      </div>
      
      {/* Поиск */}
      <div className="p-3 border-b dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск суры..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {filteredSurahs.map((surah, index) => (
          <motion.button
            key={surah.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index * 0.02, 0.5) }}
            onClick={() => onSelectSurah(surah.id)}
            className={`w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors ${
              selectedSurah === surah.id
                ? 'bg-emerald-100 border-l-4 border-l-emerald-600'
                : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                {surah.id}
              </span>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  {surah.nameRussian}
                </p>
                <p
                  className="text-emerald-600 text-sm font-arabic"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {surah.nameArabic}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-gray-500 text-xs block">
                  {surah.versesCount} аятов
                </span>
                <span className="text-gray-400 text-xs">
                  {surah.revelationType === 'Meccan' ? 'Мекканская' : 'Мединская'}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
