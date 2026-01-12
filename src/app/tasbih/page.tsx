'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, VolumeX, Vibrate, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface TasbihItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
}

interface TasbihData {
  subhanallah: number;
  alhamdulillah: number;
  allahuakbar: number;
  lailaha: number;
  astaghfirullah: number;
  salawat: number;
  totalCount: number;
}

const TASBIH_ITEMS: TasbihItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'СубханАллах',
    translation: 'Пречист Аллах',
    target: 33
  },
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'АльхамдулиЛлях',
    translation: 'Хвала Аллаху',
    target: 33
  },
  {
    id: 'allahuakbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Аллаху Акбар',
    translation: 'Аллах Велик',
    target: 34
  },
  {
    id: 'lailaha',
    arabic: 'لَا إِلٰهَ إِلَّا ٱللَّٰهُ',
    transliteration: 'Ля иляха илля-Ллах',
    translation: 'Нет божества, кроме Аллаха',
    target: 100
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    transliteration: 'АстагфируЛлах',
    translation: 'Прошу прощения у Аллаха',
    target: 100
  },
  {
    id: 'salawat',
    arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'Аллахумма солли аля Мухаммад',
    translation: 'О Аллах, благослови Мухаммада ﷺ',
    target: 100
  }
];

export default function TasbihPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tasbihData, setTasbihData] = useState<TasbihData | null>(null);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastResetCheck, setLastResetCheck] = useState<string>('');

  const currentTasbih = TASBIH_ITEMS[currentIndex];

  // Функция получения текущей даты
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Загрузка данных с сервера
  const fetchTasbihData = useCallback(async () => {
    try {
      const response = await fetch('/api/tasbih');
      if (response.ok) {
        const data = await response.json();
        setTasbihData(data);
      }
    } catch (error) {
      console.error('Error fetching tasbih:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка данных при старте
  useEffect(() => {
    fetchTasbihData();
    setLastResetCheck(getTodayDate());
  }, [fetchTasbihData]);

  // Проверка на смену дня (автосброс в 00:01)
  useEffect(() => {
    const checkDayChange = () => {
      const today = getTodayDate();
      if (lastResetCheck && lastResetCheck !== today) {
        // День изменился - перезагружаем данные (сервер создаст новую запись)
        fetchTasbihData();
        setLastResetCheck(today);
      }
    };

    // Проверяем каждую минуту
    const interval = setInterval(checkDayChange, 60000);
    
    return () => clearInterval(interval);
  }, [lastResetCheck, fetchTasbihData]);

  // Обновление счётчика на сервере
  const updateTasbih = async (type: string, action: 'increment' | 'reset' | 'resetAll') => {
    try {
      const response = await fetch('/api/tasbih', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action })
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasbihData(data);
        return true;
      }
    } catch (error) {
      console.error('Error updating tasbih:', error);
    }
    return false;
  };

  const handleCount = useCallback(async () => {
    if (!tasbihData) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);

    // Вибрация
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(30);
    }

    // Звук
    if (soundEnabled) {
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    const currentCount = tasbihData[currentTasbih.id as keyof TasbihData] as number;
    
    // Обновляем на сервере
    await updateTasbih(currentTasbih.id, 'increment');

    // Проверяем достижение цели
    if (currentCount + 1 >= currentTasbih.target) {
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      // Авто-переход к следующему зикру
      setTimeout(() => {
        if (currentIndex < TASBIH_ITEMS.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }, 500);
    }
  }, [currentIndex, currentTasbih, tasbihData, vibrationEnabled, soundEnabled]);

  const handleReset = async () => {
    await updateTasbih(currentTasbih.id, 'reset');
  };

  const handleResetAll = async () => {
    await updateTasbih(currentTasbih.id, 'resetAll');
    setCurrentIndex(0);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < TASBIH_ITEMS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading || !tasbihData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const currentCount = tasbihData[currentTasbih.id as keyof TasbihData] as number;
  const progress = (currentCount / currentTasbih.target) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Тасбих
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Поминание Аллаха
          </p>
        </div>

        {/* Tasbih Selector */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex gap-2">
            {TASBIH_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-emerald-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === TASBIH_ITEMS.length - 1}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Current Tasbih Display */}
        <motion.div
          key={currentTasbih.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-8"
        >
          <div className="text-center">
            <p className="arabic-text text-4xl text-emerald-700 dark:text-emerald-400 mb-4">
              {currentTasbih.arabic}
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {currentTasbih.transliteration}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {currentTasbih.translation}
            </p>
          </div>
        </motion.div>

        {/* Counter Button */}
        <div className="flex flex-col items-center mb-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCount}
            className="relative w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl shadow-emerald-500/30 flex items-center justify-center"
          >
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="90"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="90"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-200"
              />
            </svg>

            {/* Counter */}
            <motion.div
              animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.15 }}
              className="text-center z-10"
            >
              <span className="text-6xl font-bold text-white">
                {currentCount}
              </span>
              <p className="text-emerald-100 text-sm mt-1">
                из {currentTasbih.target}
              </p>
            </motion.div>
          </motion.button>

          <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
            Нажмите для подсчёта
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </button>

          <button
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`p-3 rounded-lg transition-colors ${
              vibrationEnabled
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
            title={vibrationEnabled ? 'Отключить вибрацию' : 'Включить вибрацию'}
          >
            <Vibrate className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-lg transition-colors ${
              soundEnabled
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
            title={soundEnabled ? 'Отключить звук' : 'Включить звук'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Всего за сегодня</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasbihData.totalCount}</p>
            </div>
            <button
              onClick={handleResetAll}
              className="text-sm text-red-500 hover:text-red-600 dark:text-red-400"
            >
              Сбросить всё
            </button>
          </div>
        </div>

        {/* Quick Select */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Быстрый выбор
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {TASBIH_ITEMS.map((item, idx) => {
              const itemCount = tasbihData[item.id as keyof TasbihData] as number;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    idx === currentIndex
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 border-2 border-emerald-500'
                      : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {item.transliteration}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {itemCount}/{item.target}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
