// API сервис для загрузки полного текста Корана
// Использует открытый API: https://api.alquran.cloud/

import { allSurahs } from './surah-list';

export interface QuranVerse {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
}

export interface QuranEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: QuranVerse[];
}

// Кэш для загруженных сур
const surahCache: Map<number, {
  arabic: QuranVerse[];
  russian: QuranVerse[];
  transliteration: QuranVerse[];
}> = new Map();

// Загрузка суры из API
export async function fetchSurahFromAPI(surahNumber: number): Promise<{
  arabic: QuranVerse[];
  russian: QuranVerse[];
  transliteration: QuranVerse[];
} | null> {
  // Проверяем кэш
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  try {
    // Загружаем арабский текст, русский перевод и транслитерацию параллельно
    const [arabicResponse, russianResponse, translitResponse] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ru.kuliev`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`),
    ]);

    if (!arabicResponse.ok || !russianResponse.ok || !translitResponse.ok) {
      console.error('Failed to fetch surah from API');
      return null;
    }

    const arabicData = await arabicResponse.json();
    const russianData = await russianResponse.json();
    const translitData = await translitResponse.json();

    const result = {
      arabic: arabicData.data.ayahs as QuranVerse[],
      russian: russianData.data.ayahs as QuranVerse[],
      transliteration: translitData.data.ayahs as QuranVerse[],
    };

    // Сохраняем в кэш
    surahCache.set(surahNumber, result);

    return result;
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

// Форматирование данных суры для отображения
export interface FormattedVerse {
  id: number;
  verseNumber: number;
  textArabic: string;
  textRussian: string;
  transliteration: string;
  juz: number;
  page: number;
}

export interface FormattedSurah {
  id: number;
  surahNumber: number;
  nameArabic: string;
  nameRussian: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: string;
  verses: FormattedVerse[];
}

export async function getFormattedSurah(surahNumber: number): Promise<FormattedSurah | null> {
  const surahInfo = allSurahs.find(s => s.id === surahNumber);
  if (!surahInfo) return null;

  const apiData = await fetchSurahFromAPI(surahNumber);
  
  if (!apiData) {
    // Возвращаем информацию о суре без аятов
    return {
      id: surahNumber,
      surahNumber,
      nameArabic: surahInfo.nameArabic,
      nameRussian: surahInfo.nameRussian,
      nameEnglish: surahInfo.nameEnglish,
      versesCount: surahInfo.versesCount,
      revelationType: surahInfo.revelationType,
      verses: [],
    };
  }

  const verses: FormattedVerse[] = apiData.arabic.map((arabicVerse, index) => ({
    id: arabicVerse.number,
    verseNumber: arabicVerse.numberInSurah,
    textArabic: arabicVerse.text,
    textRussian: apiData.russian[index]?.text || '',
    transliteration: apiData.transliteration[index]?.text || '',
    juz: arabicVerse.juz,
    page: arabicVerse.page,
  }));

  return {
    id: surahNumber,
    surahNumber,
    nameArabic: surahInfo.nameArabic,
    nameRussian: surahInfo.nameRussian,
    nameEnglish: surahInfo.nameEnglish,
    versesCount: surahInfo.versesCount,
    revelationType: surahInfo.revelationType,
    verses,
  };
}

// Загрузка всего Корана (для офлайн режима)
export async function fetchFullQuran(): Promise<Map<number, FormattedSurah>> {
  const quranData = new Map<number, FormattedSurah>();
  
  for (const surah of allSurahs) {
    const formattedSurah = await getFormattedSurah(surah.id);
    if (formattedSurah) {
      quranData.set(surah.id, formattedSurah);
    }
    // Небольшая задержка чтобы не перегружать API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return quranData;
}

// Поиск по тексту Корана
export async function searchQuran(query: string, surahNumber?: number): Promise<FormattedVerse[]> {
  const results: FormattedVerse[] = [];
  const searchLower = query.toLowerCase();
  
  const surahsToSearch = surahNumber 
    ? [allSurahs.find(s => s.id === surahNumber)!]
    : allSurahs;
  
  for (const surah of surahsToSearch) {
    if (!surah) continue;
    
    const formattedSurah = await getFormattedSurah(surah.id);
    if (!formattedSurah) continue;
    
    for (const verse of formattedSurah.verses) {
      if (verse.textRussian.toLowerCase().includes(searchLower)) {
        results.push(verse);
      }
    }
    
    // Ограничиваем результаты
    if (results.length >= 50) break;
  }
  
  return results;
}
