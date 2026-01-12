'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, CloudSun, Sunset, MoonStar, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchPrayerTimes, getPrayerNameRu, getNextPrayer, type PrayerTimesData } from '@/lib/prayer-api';

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
}

export default function PrayerTimesCard() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const createPrayersList = (times: PrayerTimesData): PrayerTime[] => [
    { name: 'fajr', time: times.fajr, icon: <MoonStar className="w-5 h-5" /> },
    { name: 'sunrise', time: times.sunrise, icon: <Sun className="w-5 h-5" /> },
    { name: 'dhuhr', time: times.dhuhr, icon: <CloudSun className="w-5 h-5" /> },
    { name: 'asr', time: times.asr, icon: <Sun className="w-5 h-5" /> },
    { name: 'maghrib', time: times.maghrib, icon: <Sunset className="w-5 h-5" /> },
    { name: 'isha', time: times.isha, icon: <Moon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const loadPrayerTimes = async (latitude: number, longitude: number) => {
      // Fetch prayer times from API
      const times = await fetchPrayerTimes(latitude, longitude);
      
      if (times) {
        setPrayerTimes(createPrayersList(times));
        setNextPrayer(getNextPrayer(times));
      }
      
      // Try to get city name from coordinates
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        setLocation({
          city: data.address?.city || data.address?.town || data.address?.village || 'Неизвестно',
          country: data.address?.country || '',
        });
      } catch {
        setLocation({ city: 'Неизвестно', country: '' });
      }
      
      setLoading(false);
    };

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadPrayerTimes(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to Moscow coordinates
          loadPrayerTimes(55.7558, 37.6173);
          setLocation({ city: 'Москва', country: 'Россия' });
        }
      );
    } else {
      // Fallback to Moscow
      loadPrayerTimes(55.7558, 37.6173);
      setLocation({ city: 'Москва', country: 'Россия' });
    }
  }, []);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-center h-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <Clock className="w-8 h-8" />
          </motion.div>
          <span className="ml-3">Загрузка времени намаза...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-xl"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Время намаза</h2>
          {location && (
            <p className="text-emerald-100 text-sm">
              📍 {location.city}, {location.country}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{currentTime}</p>
          <p className="text-emerald-100 text-sm">
            {new Date().toLocaleDateString('ru-RU', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Next Prayer Highlight */}
      {nextPrayer && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/20 rounded-xl p-4 mb-6 backdrop-blur-sm"
        >
          <p className="text-emerald-100 text-sm mb-1">Следующий намаз</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">
              {getPrayerNameRu(nextPrayer.name)}
            </span>
            <span className="text-2xl font-bold">{nextPrayer.time}</span>
          </div>
        </motion.div>
      )}

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {prayerTimes.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-3 text-center ${
                nextPrayer?.name === prayer.name
                  ? 'bg-white text-emerald-700'
                  : 'bg-white/10'
              }`}
            >
              <div className="flex justify-center mb-1">{prayer.icon}</div>
              <p className="text-xs font-medium mb-1">
                {getPrayerNameRu(prayer.name)}
              </p>
              <p className="font-bold">{prayer.time}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
