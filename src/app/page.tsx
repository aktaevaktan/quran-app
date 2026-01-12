'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Star,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { fetchPrayerTimes, type PrayerTimesData } from '@/lib/prayer-api';
import { gregorianToHijri, formatGregorianDate } from '@/lib/hijri';

const PRAYER_NAMES: Record<string, string> = {
  fajr: 'Фаджр',
  sunrise: 'Восход',
  dhuhr: 'Зухр',
  asr: 'Аср',
  maghrib: 'Магриб',
  isha: 'Иша',
};

const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function Home() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState(gregorianToHijri(new Date()));
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load prayer times
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        // Check for saved location
        const savedLocation = localStorage.getItem('user-location');
        let coords = { latitude: 43.238949, longitude: 76.945465 }; // Default: Almaty

        if (savedLocation) {
          const loc = JSON.parse(savedLocation);
          coords = { latitude: loc.latitude, longitude: loc.longitude };
          setLocation({ city: loc.city, country: loc.country });
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              
              // Get location name
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=ru`
                );
                const data = await response.json();
                const newLocation = {
                  city: data.city || data.locality || 'Неизвестно',
                  country: data.countryName || 'Неизвестно',
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                };
                setLocation(newLocation);
                localStorage.setItem('user-location', JSON.stringify(newLocation));
              } catch {}

              const times = await fetchPrayerTimes(coords.latitude, coords.longitude);
              setPrayerTimes(times);
            },
            () => {
              // Use default if permission denied
              fetchPrayerTimes(coords.latitude, coords.longitude).then(setPrayerTimes);
            }
          );
          return;
        }

        const times = await fetchPrayerTimes(coords.latitude, coords.longitude);
        setPrayerTimes(times);
      } catch (error) {
        console.error('Error loading prayer times:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrayerTimes();
  }, []);

  // Calculate next prayer
  useEffect(() => {
    if (!prayerTimes) return;

    const now = currentTime;
    const todayStr = now.toISOString().split('T')[0];

    for (const prayerKey of PRAYER_ORDER) {
      const time = prayerTimes[prayerKey as keyof PrayerTimesData];
      if (!time) continue;

      const [hours, minutes] = time.split(':').map(Number);
      const prayerDate = new Date(todayStr);
      prayerDate.setHours(hours, minutes, 0, 0);

      if (prayerDate > now) {
        const diff = prayerDate.getTime() - now.getTime();
        const remainingHours = Math.floor(diff / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const remainingSeconds = Math.floor((diff % (1000 * 60)) / 1000);

        setNextPrayer({
          name: PRAYER_NAMES[prayerKey],
          time: time,
          remaining: remainingHours > 0 
            ? `${remainingHours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
            : `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`,
        });
        return;
      }
    }

    // If all prayers passed, next is Fajr tomorrow
    setNextPrayer({
      name: 'Фаджр',
      time: prayerTimes.fajr,
      remaining: '--:--',
    });
  }, [prayerTimes, currentTime]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section with Prayer Times */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
          {/* Location & Date */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-2 text-emerald-100">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {location ? `${location.city}, ${location.country}` : 'Определение...'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-emerald-100 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatGregorianDate(currentTime)}</span>
              </div>
              <span className="hijri-date">{hijriDate.formatted}</span>
            </div>
          </motion.div>

          {/* Next Prayer Countdown */}
          {nextPrayer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <p className="text-emerald-200 text-sm mb-1">До {nextPrayer.name}</p>
              <p className="text-5xl md:text-7xl font-bold pulse-countdown">
                {nextPrayer.remaining}
              </p>
              <p className="text-emerald-200 mt-2">{nextPrayer.time}</p>
            </motion.div>
          )}

          {/* Prayer Times Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 pb-16"
          >
            {PRAYER_ORDER.map((prayerKey) => {
              const time = prayerTimes?.[prayerKey as keyof PrayerTimesData];
              const isNext = nextPrayer?.name === PRAYER_NAMES[prayerKey];
              
              return (
                <div
                  key={prayerKey}
                  className={`rounded-xl p-3 text-center transition-all ${
                    isNext 
                      ? 'bg-white/20 ring-2 ring-white/50' 
                      : 'bg-white/10'
                  }`}
                >
                  <p className="text-emerald-200 text-xs mb-1">
                    {PRAYER_NAMES[prayerKey]}
                  </p>
                  <p className={`font-bold ${isNext ? 'text-xl' : 'text-lg'}`}>
                    {loading ? '--:--' : time || '--:--'}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-gray-50 dark:fill-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Quran */}
          <Link href="/quran">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Коран</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Читать с переводом</p>
            </motion.div>
          </Link>

          {/* Prayer Times */}
          <Link href="/prayer-times">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Время намаза</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Календарь молитв</p>
            </motion.div>
          </Link>

          {/* Tasbih */}
          <Link href="/tasbih">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">��</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Тасбих</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Счётчик зикра</p>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Quick Access - Recent Surahs */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Популярные суры
          </h2>
          <Link href="/quran" className="text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
            Все суры <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 1, name: 'Аль-Фатиха', arabic: 'الفاتحة', verses: 7, meaning: 'Открывающая' },
            { id: 36, name: 'Ясин', arabic: 'يس', verses: 83, meaning: 'Сердце Корана' },
            { id: 67, name: 'Аль-Мульк', arabic: 'الملك', verses: 30, meaning: 'Власть' },
            { id: 55, name: 'Ар-Рахман', arabic: 'الرحمن', verses: 78, meaning: 'Милостивый' },
            { id: 112, name: 'Аль-Ихлас', arabic: 'الإخلاص', verses: 4, meaning: 'Искренность' },
            { id: 114, name: 'Ан-Нас', arabic: 'الناس', verses: 6, meaning: 'Люди' },
          ].map((surah) => (
            <Link key={surah.id} href={`/quran/${surah.id}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                  {surah.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {surah.name}
                    </h3>
                    <span className="arabic-text text-lg text-emerald-600 dark:text-emerald-400">
                      {surah.arabic}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {surah.verses} аятов • {surah.meaning}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Ayah */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5" />
            <span className="text-emerald-100 text-sm">Аят дня</span>
          </div>
          <p className="arabic-text text-2xl md:text-3xl mb-4 text-center">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="text-lg text-center mb-2">
            «Воистину, за каждой тягостью — облегчение»
          </p>
          <p className="text-emerald-200 text-sm text-center">
            Сура «Аш-Шарх» (94:6)
          </p>
        </div>
      </section>
    </div>
  );
}
