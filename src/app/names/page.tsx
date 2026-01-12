'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Volume2, X } from 'lucide-react';

interface Name {
  id: number;
  arabic: string;
  transliteration: string;
  russian: string;
  meaning: string;
}

const NAMES_OF_ALLAH: Name[] = [
  { id: 1, arabic: 'ٱللَّٰهُ', transliteration: 'Аллах', russian: 'Аллах', meaning: 'Единственный истинный Бог' },
  { id: 2, arabic: 'ٱلرَّحْمَٰنُ', transliteration: 'Ар-Рахман', russian: 'Милостивый', meaning: 'Всемилостивый ко всем творениям' },
  { id: 3, arabic: 'ٱلرَّحِيمُ', transliteration: 'Ар-Рахим', russian: 'Милосердный', meaning: 'Особо милосердный к верующим' },
  { id: 4, arabic: 'ٱلْمَلِكُ', transliteration: 'Аль-Малик', russian: 'Властелин', meaning: 'Царь, Владыка всего сущего' },
  { id: 5, arabic: 'ٱلْقُدُّوسُ', transliteration: 'Аль-Куддус', russian: 'Святой', meaning: 'Пречистый от недостатков' },
  { id: 6, arabic: 'ٱلسَّلَامُ', transliteration: 'Ас-Салям', russian: 'Мир', meaning: 'Дарующий мир и безопасность' },
  { id: 7, arabic: 'ٱلْمُؤْمِنُ', transliteration: 'Аль-Мумин', russian: 'Оберегающий', meaning: 'Дарующий веру и безопасность' },
  { id: 8, arabic: 'ٱلْمُهَيْمِنُ', transliteration: 'Аль-Мухаймин', russian: 'Хранитель', meaning: 'Наблюдающий и охраняющий' },
  { id: 9, arabic: 'ٱلْعَزِيزُ', transliteration: 'Аль-Азиз', russian: 'Могущественный', meaning: 'Непобедимый, Великий' },
  { id: 10, arabic: 'ٱلْجَبَّارُ', transliteration: 'Аль-Джаббар', russian: 'Могучий', meaning: 'Исправляющий дела творений' },
  { id: 11, arabic: 'ٱلْمُتَكَبِّرُ', transliteration: 'Аль-Мутакаббир', russian: 'Превосходящий', meaning: 'Величественный, Гордый' },
  { id: 12, arabic: 'ٱلْخَالِقُ', transliteration: 'Аль-Халик', russian: 'Творец', meaning: 'Создатель всего сущего' },
  { id: 13, arabic: 'ٱلْبَارِئُ', transliteration: 'Аль-Бари', russian: 'Создатель', meaning: 'Создающий без образца' },
  { id: 14, arabic: 'ٱلْمُصَوِّرُ', transliteration: 'Аль-Мусаввир', russian: 'Придающий форму', meaning: 'Формирующий образы' },
  { id: 15, arabic: 'ٱلْغَفَّارُ', transliteration: 'Аль-Гаффар', russian: 'Прощающий', meaning: 'Много прощающий грехи' },
  { id: 16, arabic: 'ٱلْقَهَّارُ', transliteration: 'Аль-Каххар', russian: 'Господствующий', meaning: 'Подчиняющий всё Своей воле' },
  { id: 17, arabic: 'ٱلْوَهَّابُ', transliteration: 'Аль-Ваххаб', russian: 'Дарующий', meaning: 'Щедро одаривающий' },
  { id: 18, arabic: 'ٱلرَّزَّاقُ', transliteration: 'Ар-Раззак', russian: 'Наделяющий', meaning: 'Дающий пропитание' },
  { id: 19, arabic: 'ٱلْفَتَّاحُ', transliteration: 'Аль-Фаттах', russian: 'Открывающий', meaning: 'Открывающий врата блага' },
  { id: 20, arabic: 'ٱلْعَلِيمُ', transliteration: 'Аль-Алим', russian: 'Всезнающий', meaning: 'Знающий всё явное и скрытое' },
  { id: 21, arabic: 'ٱلْقَابِضُ', transliteration: 'Аль-Кабид', russian: 'Сжимающий', meaning: 'Сужающий удел' },
  { id: 22, arabic: 'ٱلْبَاسِطُ', transliteration: 'Аль-Басит', russian: 'Расширяющий', meaning: 'Расширяющий удел' },
  { id: 23, arabic: 'ٱلْخَافِضُ', transliteration: 'Аль-Хафид', russian: 'Понижающий', meaning: 'Унижающий неверных' },
  { id: 24, arabic: 'ٱلرَّافِعُ', transliteration: 'Ар-Рафи', russian: 'Возвышающий', meaning: 'Возвышающий верующих' },
  { id: 25, arabic: 'ٱلْمُعِزُّ', transliteration: 'Аль-Муизз', russian: 'Дающий силу', meaning: 'Дарующий могущество' },
  { id: 26, arabic: 'ٱلْمُذِلُّ', transliteration: 'Аль-Музилль', russian: 'Унижающий', meaning: 'Лишающий силы' },
  { id: 27, arabic: 'ٱلسَّمِيعُ', transliteration: 'Ас-Сами', russian: 'Всеслышащий', meaning: 'Слышащий всё' },
  { id: 28, arabic: 'ٱلْبَصِيرُ', transliteration: 'Аль-Басир', russian: 'Всевидящий', meaning: 'Видящий всё' },
  { id: 29, arabic: 'ٱلْحَكَمُ', transliteration: 'Аль-Хакам', russian: 'Судья', meaning: 'Судящий справедливо' },
  { id: 30, arabic: 'ٱلْعَدْلُ', transliteration: 'Аль-Адль', russian: 'Справедливый', meaning: 'Абсолютно справедливый' },
  { id: 31, arabic: 'ٱللَّطِيفُ', transliteration: 'Аль-Латиф', russian: 'Добрый', meaning: 'Проявляющий доброту к рабам' },
  { id: 32, arabic: 'ٱلْخَبِيرُ', transliteration: 'Аль-Хабир', russian: 'Сведущий', meaning: 'Знающий суть вещей' },
  { id: 33, arabic: 'ٱلْحَلِيمُ', transliteration: 'Аль-Халим', russian: 'Кроткий', meaning: 'Снисходительный' },
  { id: 34, arabic: 'ٱلْعَظِيمُ', transliteration: 'Аль-Азым', russian: 'Великий', meaning: 'Величайший' },
  { id: 35, arabic: 'ٱلْغَفُورُ', transliteration: 'Аль-Гафур', russian: 'Всепрощающий', meaning: 'Прощающий грехи рабов' },
  { id: 36, arabic: 'ٱلشَّكُورُ', transliteration: 'Аш-Шакур', russian: 'Благодарный', meaning: 'Вознаграждающий за благодарность' },
  { id: 37, arabic: 'ٱلْعَلِيُّ', transliteration: 'Аль-Алий', russian: 'Высочайший', meaning: 'Превыше всего' },
  { id: 38, arabic: 'ٱلْكَبِيرُ', transliteration: 'Аль-Кабир', russian: 'Величайший', meaning: 'Больше всего' },
  { id: 39, arabic: 'ٱلْحَفِيظُ', transliteration: 'Аль-Хафиз', russian: 'Хранящий', meaning: 'Оберегающий творения' },
  { id: 40, arabic: 'ٱلْمُقِيتُ', transliteration: 'Аль-Мукит', russian: 'Питающий', meaning: 'Дающий силу и пропитание' },
  { id: 41, arabic: 'ٱلْحَسِيبُ', transliteration: 'Аль-Хасиб', russian: 'Взыскивающий', meaning: 'Ведущий счёт делам' },
  { id: 42, arabic: 'ٱلْجَلِيلُ', transliteration: 'Аль-Джалиль', russian: 'Величественный', meaning: 'Обладатель величия' },
  { id: 43, arabic: 'ٱلْكَرِيمُ', transliteration: 'Аль-Карим', russian: 'Щедрый', meaning: 'Благородный и щедрый' },
  { id: 44, arabic: 'ٱلرَّقِيبُ', transliteration: 'Ар-Ракиб', russian: 'Наблюдающий', meaning: 'Следящий за всем' },
  { id: 45, arabic: 'ٱلْمُجِيبُ', transliteration: 'Аль-Муджиб', russian: 'Отвечающий', meaning: 'Отвечающий на мольбы' },
  { id: 46, arabic: 'ٱلْوَاسِعُ', transliteration: 'Аль-Васи', russian: 'Всеобъемлющий', meaning: 'Объемлющий всё знанием' },
  { id: 47, arabic: 'ٱلْحَكِيمُ', transliteration: 'Аль-Хаким', russian: 'Мудрый', meaning: 'Премудрый во всём' },
  { id: 48, arabic: 'ٱلْوَدُودُ', transliteration: 'Аль-Вадуд', russian: 'Любящий', meaning: 'Любящий рабов Своих' },
  { id: 49, arabic: 'ٱلْمَجِيدُ', transliteration: 'Аль-Маджид', russian: 'Славный', meaning: 'Преславный' },
  { id: 50, arabic: 'ٱلْبَاعِثُ', transliteration: 'Аль-Баис', russian: 'Воскрешающий', meaning: 'Воскрешающий мёртвых' },
  { id: 51, arabic: 'ٱلشَّهِيدُ', transliteration: 'Аш-Шахид', russian: 'Свидетель', meaning: 'Свидетель всего' },
  { id: 52, arabic: 'ٱلْحَقُّ', transliteration: 'Аль-Хакк', russian: 'Истинный', meaning: 'Истина' },
  { id: 53, arabic: 'ٱلْوَكِيلُ', transliteration: 'Аль-Вакиль', russian: 'Попечитель', meaning: 'Управляющий делами' },
  { id: 54, arabic: 'ٱلْقَوِيُّ', transliteration: 'Аль-Кавий', russian: 'Сильный', meaning: 'Обладатель силы' },
  { id: 55, arabic: 'ٱلْمَتِينُ', transliteration: 'Аль-Матин', russian: 'Крепкий', meaning: 'Несокрушимый' },
  { id: 56, arabic: 'ٱلْوَلِيُّ', transliteration: 'Аль-Валий', russian: 'Покровитель', meaning: 'Защитник верующих' },
  { id: 57, arabic: 'ٱلْحَمِيدُ', transliteration: 'Аль-Хамид', russian: 'Достохвальный', meaning: 'Достойный похвалы' },
  { id: 58, arabic: 'ٱلْمُحْصِي', transliteration: 'Аль-Мухси', russian: 'Исчисляющий', meaning: 'Учитывающий всё' },
  { id: 59, arabic: 'ٱلْمُبْدِئُ', transliteration: 'Аль-Мубди', russian: 'Начинающий', meaning: 'Создающий изначально' },
  { id: 60, arabic: 'ٱلْمُعِيدُ', transliteration: 'Аль-Муид', russian: 'Возвращающий', meaning: 'Возвращающий к жизни' },
  { id: 61, arabic: 'ٱلْمُحْيِي', transliteration: 'Аль-Мухьи', russian: 'Оживляющий', meaning: 'Дающий жизнь' },
  { id: 62, arabic: 'ٱلْمُمِيتُ', transliteration: 'Аль-Мумит', russian: 'Умертвляющий', meaning: 'Забирающий жизнь' },
  { id: 63, arabic: 'ٱلْحَيُّ', transliteration: 'Аль-Хайй', russian: 'Живой', meaning: 'Вечно живой' },
  { id: 64, arabic: 'ٱلْقَيُّومُ', transliteration: 'Аль-Каййум', russian: 'Самосущий', meaning: 'Поддерживающий всё' },
  { id: 65, arabic: 'ٱلْوَاجِدُ', transliteration: 'Аль-Ваджид', russian: 'Находящий', meaning: 'Ни в чём не нуждающийся' },
  { id: 66, arabic: 'ٱلْمَاجِدُ', transliteration: 'Аль-Маджид', russian: 'Благородный', meaning: 'Преславный и щедрый' },
  { id: 67, arabic: 'ٱلْوَاحِدُ', transliteration: 'Аль-Вахид', russian: 'Единственный', meaning: 'Единый, нет ему подобных' },
  { id: 68, arabic: 'ٱلصَّمَدُ', transliteration: 'Ас-Самад', russian: 'Вечный', meaning: 'Не нуждающийся ни в ком' },
  { id: 69, arabic: 'ٱلْقَادِرُ', transliteration: 'Аль-Кадир', russian: 'Всемогущий', meaning: 'Способный на всё' },
  { id: 70, arabic: 'ٱلْمُقْتَدِرُ', transliteration: 'Аль-Муктадир', russian: 'Властный', meaning: 'Обладатель могущества' },
  { id: 71, arabic: 'ٱلْمُقَدِّمُ', transliteration: 'Аль-Мукаддим', russian: 'Выдвигающий', meaning: 'Приближающий' },
  { id: 72, arabic: 'ٱلْمُؤَخِّرُ', transliteration: 'Аль-Муаххир', russian: 'Отодвигающий', meaning: 'Отдаляющий' },
  { id: 73, arabic: 'ٱلْأَوَّلُ', transliteration: 'Аль-Авваль', russian: 'Первый', meaning: 'Предвечный' },
  { id: 74, arabic: 'ٱلْآخِرُ', transliteration: 'Аль-Ахир', russian: 'Последний', meaning: 'Вечный после всех' },
  { id: 75, arabic: 'ٱلظَّاهِرُ', transliteration: 'Аз-Захир', russian: 'Явный', meaning: 'Очевидный по знамениям' },
  { id: 76, arabic: 'ٱلْبَاطِنُ', transliteration: 'Аль-Батын', russian: 'Скрытый', meaning: 'Сущность непостижима' },
  { id: 77, arabic: 'ٱلْوَالِي', transliteration: 'Аль-Вали', russian: 'Правитель', meaning: 'Управляющий делами' },
  { id: 78, arabic: 'ٱلْمُتَعَالِي', transliteration: 'Аль-Мутаали', russian: 'Возвышенный', meaning: 'Превыше всего' },
  { id: 79, arabic: 'ٱلْبَرُّ', transliteration: 'Аль-Барр', russian: 'Благостный', meaning: 'Благой к творениям' },
  { id: 80, arabic: 'ٱلتَّوَّابُ', transliteration: 'Ат-Тавваб', russian: 'Принимающий покаяние', meaning: 'Много принимающий покаяние' },
  { id: 81, arabic: 'ٱلْمُنْتَقِمُ', transliteration: 'Аль-Мунтаким', russian: 'Карающий', meaning: 'Воздающий по заслугам' },
  { id: 82, arabic: 'ٱلْعَفُوُّ', transliteration: 'Аль-Афувв', russian: 'Снисходительный', meaning: 'Много прощающий' },
  { id: 83, arabic: 'ٱلرَّءُوفُ', transliteration: 'Ар-Рауф', russian: 'Сострадательный', meaning: 'Снисходительный к рабам' },
  { id: 84, arabic: 'مَالِكُ ٱلْمُلْكِ', transliteration: 'Малик уль-Мульк', russian: 'Властелин царства', meaning: 'Владыка всего' },
  { id: 85, arabic: 'ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ', transliteration: 'Зуль-Джаляли валь-Икрам', russian: 'Обладатель величия', meaning: 'Величия и почёта' },
  { id: 86, arabic: 'ٱلْمُقْسِطُ', transliteration: 'Аль-Муксит', russian: 'Беспристрастный', meaning: 'Устанавливающий справедливость' },
  { id: 87, arabic: 'ٱلْجَامِعُ', transliteration: 'Аль-Джами', russian: 'Собирающий', meaning: 'Собирающий в День Суда' },
  { id: 88, arabic: 'ٱلْغَنِيُّ', transliteration: 'Аль-Ганий', russian: 'Богатый', meaning: 'Не нуждающийся ни в ком' },
  { id: 89, arabic: 'ٱلْمُغْنِي', transliteration: 'Аль-Мугни', russian: 'Обогащающий', meaning: 'Делающий богатым' },
  { id: 90, arabic: 'ٱلْمَانِعُ', transliteration: 'Аль-Мани', russian: 'Удерживающий', meaning: 'Защищающий' },
  { id: 91, arabic: 'ٱلضَّارُّ', transliteration: 'Ад-Дарр', russian: 'Вредящий', meaning: 'Создающий вред' },
  { id: 92, arabic: 'ٱلنَّافِعُ', transliteration: 'Ан-Нафи', russian: 'Приносящий пользу', meaning: 'Создающий пользу' },
  { id: 93, arabic: 'ٱلنُّورُ', transliteration: 'Ан-Нур', russian: 'Свет', meaning: 'Освещающий' },
  { id: 94, arabic: 'ٱلْهَادِي', transliteration: 'Аль-Хади', russian: 'Ведущий', meaning: 'Наставляющий на путь' },
  { id: 95, arabic: 'ٱلْبَدِيعُ', transliteration: 'Аль-Бади', russian: 'Изумительный', meaning: 'Творящий без образца' },
  { id: 96, arabic: 'ٱلْبَاقِي', transliteration: 'Аль-Баки', russian: 'Вечный', meaning: 'Остающийся после всего' },
  { id: 97, arabic: 'ٱلْوَارِثُ', transliteration: 'Аль-Варис', russian: 'Наследующий', meaning: 'Наследник всего' },
  { id: 98, arabic: 'ٱلرَّشِيدُ', transliteration: 'Ар-Рашид', russian: 'Направляющий', meaning: 'Ведущий к благу' },
  { id: 99, arabic: 'ٱلصَّبُورُ', transliteration: 'Ас-Сабур', russian: 'Терпеливый', meaning: 'Долготерпеливый' },
];

export default function NamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<Name | null>(null);

  const filteredNames = NAMES_OF_ALLAH.filter(name =>
    name.russian.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            99 имён Аллаха
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Асмау-ль-Хусна — Прекрасные имена
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск имени..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Names Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNames.map((name) => (
            <motion.button
              key={name.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedName(name)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-sm font-bold shrink-0">
                  {name.id}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="arabic-text text-2xl text-emerald-700 dark:text-emerald-400 mb-1">
                    {name.arabic}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {name.transliteration}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {name.russian}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* No results */}
        {filteredNames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Ничего не найдено
            </p>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setSelectedName(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                    {selectedName.id}
                  </span>
                  <button
                    onClick={() => setSelectedName(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <p className="arabic-text text-5xl text-emerald-700 dark:text-emerald-400 mb-4">
                    {selectedName.arabic}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {selectedName.transliteration}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {selectedName.russian}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Значение
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {selectedName.meaning}
                  </p>
                </div>

                <button
                  className="w-full py-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                  Прослушать произношение
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
