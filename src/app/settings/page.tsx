'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Moon, 
  Sun, 
  Bell, 
  MapPin, 
  Clock, 
  BookOpen, 
  Globe,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const CALCULATION_METHODS = [
  { id: '14', name: 'ДУМК (Россия)' },
  { id: '2', name: 'ISNA (Северная Америка)' },
  { id: '3', name: 'MWL (Мусульманская Мировая Лига)' },
  { id: '4', name: 'Umm Al-Qura (Мекка)' },
  { id: '5', name: 'Египет' },
  { id: '1', name: 'Карачи (Пакистан)' },
];

const ASR_METHODS = [
  { id: '0', name: 'Шафии/Ханбали/Малики' },
  { id: '1', name: 'Ханафи' },
];

const FONT_SIZES = [
  { id: 'small', name: 'Маленький', size: '1rem' },
  { id: 'medium', name: 'Средний', size: '1.25rem' },
  { id: 'large', name: 'Большой', size: '1.5rem' },
  { id: 'xlarge', name: 'Очень большой', size: '1.75rem' },
];

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  
  const [calculationMethod, setCalculationMethod] = useState('14');
  const [asrMethod, setAsrMethod] = useState('1');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState('medium');
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCalculationMethod(settings.calculationMethod || '14');
      setAsrMethod(settings.asrMethod || '1');
      setNotificationsEnabled(settings.notificationsEnabled || false);
      setArabicFontSize(settings.arabicFontSize || 'medium');
      setShowTransliteration(settings.showTransliteration !== false);
    }

    const savedLocation = localStorage.getItem('user-location');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify({
      calculationMethod,
      asrMethod,
      notificationsEnabled,
      arabicFontSize,
      showTransliteration,
    }));
  }, [calculationMethod, asrMethod, notificationsEnabled, arabicFontSize, showTransliteration]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const detectLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=ru`
          );
          const data = await response.json();
          const newLocation = {
            city: data.city || data.locality || 'Неизвестно',
            country: data.countryName || 'Неизвестно',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          localStorage.setItem('user-location', JSON.stringify(newLocation));
        } catch {
          console.error('Error getting location name');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Настройки
        </h1>

        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Профиль
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {session ? (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Войти в аккаунт
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Для сохранения закладок
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Appearance */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Внешний вид
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Theme Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Тема</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {theme === 'light' ? 'Светлая' : 'Тёмная'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              >
                <motion.div
                  animate={{ x: theme === 'dark' ? 24 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Arabic Font Size */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="font-medium text-gray-900 dark:text-white">Размер арабского шрифта</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {FONT_SIZES.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setArabicFontSize(size.id)}
                    className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                      arabicFontSize === size.id
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Prayer Times Settings */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Время намаза
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Location */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Местоположение</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {location ? `${location.city}, ${location.country}` : 'Не определено'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={detectLocation}
                  className="px-4 py-2 text-sm bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
                >
                  Определить
                </button>
              </div>
            </div>

            {/* Calculation Method */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="font-medium text-gray-900 dark:text-white">Метод расчёта</p>
              </div>
              <select
                value={calculationMethod}
                onChange={(e) => setCalculationMethod(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-emerald-500"
              >
                {CALCULATION_METHODS.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Asr Method */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="font-medium text-gray-900 dark:text-white">Метод расчёта Аср</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ASR_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setAsrMethod(method.id)}
                    className={`py-3 px-4 rounded-lg text-sm transition-colors ${
                      asrMethod === method.id
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                    }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Уведомления
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Уведомления о намазе</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Напоминания о времени молитвы
                  </p>
                </div>
              </div>
              <button
                onClick={requestNotificationPermission}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: notificationsEnabled ? 24 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </div>
        </section>

        {/* Quran Settings */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Коран
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Показывать транслитерацию</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Отображать текст латиницей
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTransliteration(!showTransliteration)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  showTransliteration ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: showTransliteration ? 24 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            О приложении
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L19 7L14.74 11.27L21 12L14.74 12.73L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.73L3 12L9.26 11.27L5 7L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">OctōPray</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Версия 1.0.0</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Время намаза • Коран • Кибла • Зикр
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
