'use client';

import { motion } from 'motion/react';
import { BookOpen, Clock, Star } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Читать Коран',
    description: 'Коран на русском языке с арабским текстом и транскрипцией',
    href: '/quran',
    color: 'emerald',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Время намаза',
    description: 'Точное время намаза для вашего местоположения',
    href: '/prayer-times',
    color: 'blue',
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: 'Закладки',
    description: 'Сохраняйте любимые аяты и возвращайтесь к ним',
    href: '/bookmarks',
    color: 'amber',
  },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    hover: 'hover:bg-emerald-50',
    border: 'border-emerald-200',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-50',
    border: 'border-blue-200',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    hover: 'hover:bg-amber-50',
    border: 'border-amber-200',
  },
};

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => {
        const colors = colorClasses[feature.color as keyof typeof colorClasses];
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={feature.href}>
              <div
                className={`p-6 rounded-xl border ${colors.border} ${colors.hover} transition-all duration-300 hover:shadow-md cursor-pointer group`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
