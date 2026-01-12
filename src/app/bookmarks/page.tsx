'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Trash2, BookOpen, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BookmarkItem {
  id: number;
  surahId: number;
  verseNumber: number;
  surahName: string;
  verseText: string;
  note: string | null;
  createdAt: string;
}

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      const data = await response.json();
      if (data.success) {
        setBookmarks(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (id: number) => {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBookmarks(bookmarks.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  // Not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Закладки недоступны
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Войдите в аккаунт, чтобы сохранять закладки и иметь к ним доступ
              с любого устройства.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
              >
                Зарегистрироваться
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Мои закладки
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {session.user?.name ? `Привет, ${session.user.name}!` : ''} Здесь хранятся ваши сохранённые аяты.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Закладок пока нет
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Начните читать Коран и добавляйте понравившиеся аяты в закладки.
            </p>
            <Link
              href="/quran"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Читать Коран
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <div className="bg-emerald-50 dark:bg-emerald-900/30 px-4 py-3 flex justify-between items-center border-b border-emerald-100 dark:border-emerald-800">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {bookmark.verseNumber}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {bookmark.surahName}
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                        Аят {bookmark.verseNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Удалить закладку"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-800 dark:text-gray-200">{bookmark.verseText}</p>
                  {bookmark.note && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                      Заметка: {bookmark.note}
                    </p>
                  )}
                </div>
                <div className="px-4 pb-3">
                  <Link
                    href={`/quran?surah=${bookmark.surahId}`}
                    className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline"
                  >
                    Открыть суру →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
