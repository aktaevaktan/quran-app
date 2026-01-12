'use client';

import { motion } from 'motion/react';
import PrayerTimesCard from '@/components/PrayerTimesCard';
import { MapPin, Settings, Info } from 'lucide-react';

export default function PrayerTimesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Время намаза
          </h1>
          <p className="text-gray-600">
            Точное время намаза для вашего местоположения
          </p>
        </motion.div>

        {/* Prayer Times Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PrayerTimesCard />
        </motion.div>

        {/* Info Cards */}
        <div className="mt-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Местоположение
                </h3>
                <p className="text-gray-600 text-sm">
                  Время намаза рассчитывается автоматически на основе вашего
                  местоположения. Разрешите доступ к геолокации для точного
                  расчёта.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Метод расчёта
                </h3>
                <p className="text-gray-600 text-sm">
                  Используется метод Духовного управления мусульман России
                  (угол Фаджр: 16°, угол Иша: 15°)
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  О времени намаза
                </h3>
                <p className="text-gray-600 text-sm">
                  <strong>Фаджр</strong> — рассветный намаз, начинается с
                  появления утренней зари.
                  <br />
                  <strong>Зухр</strong> — полуденный намаз, после прохождения
                  солнцем зенита.
                  <br />
                  <strong>Аср</strong> — предвечерний намаз.
                  <br />
                  <strong>Магриб</strong> — вечерний намаз, после захода солнца.
                  <br />
                  <strong>Иша</strong> — ночной намаз, после исчезновения вечерней
                  зари.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
