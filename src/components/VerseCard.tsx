'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Bookmark, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import type { FormattedVerse } from '@/lib/quran-api';
import { allSurahs } from '@/lib/surah-list';

interface VerseCardProps {
  verse: FormattedVerse;
  surahNumber: number;
}

export default function VerseCard({ verse, surahNumber }: VerseCardProps) {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const surahInfo = allSurahs.find(s => s.id === surahNumber);

  const handleBookmark = async () => {
    if (!session) {
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }

    setBookmarkLoading(true);
    
    try {
      if (isBookmarked) {
        // Remove bookmark - would need bookmark ID
        setIsBookmarked(false);
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surahId: surahNumber,
            verseNumber: verse.verseNumber,
            surahName: surahInfo?.nameRussian || `Сура ${surahNumber}`,
            verseText: verse.textRussian,
          }),
        });
        
        if (response.ok) {
          setIsBookmarked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
    >
      {/* Verse Number Badge */}
      <div className="bg-emerald-50 px-4 py-2 flex justify-between items-center border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {verse.verseNumber}
          </span>
          <span className="text-emerald-700 text-sm font-medium">
            Сура {surahNumber}, Аят {verse.verseNumber}
          </span>
          {verse.juz && (
            <span className="text-gray-400 text-xs">
              • Джуз {verse.juz}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`p-1.5 rounded-full transition-colors ${
              isBookmarked 
                ? 'text-amber-500 bg-amber-50' 
                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
            } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!session ? 'Войдите для добавления закладок' : isBookmarked ? 'Удалить закладку' : 'Добавить закладку'}
          >
            {bookmarkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            )}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors text-sm font-medium"
          >
            <BookOpen className="w-4 h-4" />
            {isExpanded ? 'Скрыть' : 'Арабский'}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Russian Translation - Always Visible */}
      <div className="p-4">
        <p className="text-gray-800 text-lg leading-relaxed">
          {verse.textRussian}
        </p>
      </div>

      {/* Expanded Content - Arabic and Transliteration */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Arabic Text */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border-t border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium mb-2 uppercase tracking-wider">
                Арабский текст
              </p>
              <p
                className="text-3xl leading-loose text-right text-gray-900 font-arabic mb-4"
                style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                dir="rtl"
              >
                {verse.textArabic}
              </p>
              
              {/* Transliteration - directly under Arabic */}
              {verse.transliteration && (
                <div className="mt-3 pt-3 border-t border-emerald-200">
                  <p className="text-xs text-amber-600 font-medium mb-1 uppercase tracking-wider">
                    Транскрипция (как читать)
                  </p>
                  <p className="text-base text-amber-800 italic leading-relaxed">
                    {verse.transliteration}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
