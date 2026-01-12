// Sample Quran data - First 3 Surahs with Kuliev translation
// In production, this would come from the database

export interface Verse {
  id: number;
  verseNumber: number;
  textArabic: string;
  textRussian: string;
  transliteration: string;
}

export interface Surah {
  id: number;
  surahNumber: number;
  nameArabic: string;
  nameRussian: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: string;
  verses: Verse[];
}

// Sample data - Al-Fatiha (The Opening) with Kuliev translation
export const sampleSurahs: Surah[] = [
  {
    id: 1,
    surahNumber: 1,
    nameArabic: "الفاتحة",
    nameRussian: "Аль-Фатиха (Открывающая)",
    nameEnglish: "Al-Fatiha",
    versesCount: 7,
    revelationType: "Meccan",
    verses: [
      {
        id: 1,
        verseNumber: 1,
        textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        textRussian: "Во имя Аллаха, Милостивого, Милосердного!",
        transliteration: "Бисми-Лляхи-р-Рахмани-р-Рахим"
      },
      {
        id: 2,
        verseNumber: 2,
        textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        textRussian: "Хвала Аллаху, Господу миров,",
        transliteration: "Аль-хамду ли-Лляхи Рабби-ль-'алямин"
      },
      {
        id: 3,
        verseNumber: 3,
        textArabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        textRussian: "Милостивому, Милосердному,",
        transliteration: "Ар-Рахмани-р-Рахим"
      },
      {
        id: 4,
        verseNumber: 4,
        textArabic: "مَالِكِ يَوْمِ الدِّينِ",
        textRussian: "Властелину Дня воздаяния!",
        transliteration: "Малики йауми-д-дин"
      },
      {
        id: 5,
        verseNumber: 5,
        textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        textRussian: "Тебе одному мы поклоняемся и Тебя одного молим о помощи.",
        transliteration: "Иййака на'буду ва иййака наста'ин"
      },
      {
        id: 6,
        verseNumber: 6,
        textArabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        textRussian: "Веди нас прямым путем,",
        transliteration: "Ихдина-с-сырата-ль-мустакым"
      },
      {
        id: 7,
        verseNumber: 7,
        textArabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        textRussian: "путем тех, кого Ты облагодетельствовал, не тех, на кого пал гнев, и не заблудших.",
        transliteration: "Сырата-ллязина ан'амта 'алейхим гайри-ль-магдуби 'алейхим ва ля-д-даллин"
      }
    ]
  },
  {
    id: 2,
    surahNumber: 2,
    nameArabic: "البقرة",
    nameRussian: "Аль-Бакара (Корова)",
    nameEnglish: "Al-Baqarah",
    versesCount: 286,
    revelationType: "Medinan",
    verses: [
      {
        id: 8,
        verseNumber: 1,
        textArabic: "الم",
        textRussian: "Алиф. Лям. Мим.",
        transliteration: "Алиф Лям Мим"
      },
      {
        id: 9,
        verseNumber: 2,
        textArabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
        textRussian: "Это Писание, в котором нет сомнения, является верным руководством для богобоязненных,",
        transliteration: "Заликя-ль-китабу ля райба фихи худа-ль-муттакын"
      },
      {
        id: 10,
        verseNumber: 3,
        textArabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
        textRussian: "которые веруют в сокровенное, совершают намаз и расходуют из того, чем Мы их наделили,",
        transliteration: "Аллязина йу'минуна би-ль-гайби ва йукымуна-с-салята ва мимма разакнахум йунфикун"
      },
      {
        id: 11,
        verseNumber: 4,
        textArabic: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
        textRussian: "которые веруют в ниспосланное тебе и ниспосланное до тебя и убеждены в Последней жизни.",
        transliteration: "Ва-ллязина йу'минуна бима унзиля иляйка ва ма унзиля мин каблика ва би-ль-ахирати хум йукинун"
      },
      {
        id: 12,
        verseNumber: 5,
        textArabic: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
        textRussian: "Они следуют верному руководству от их Господа, и они являются преуспевшими.",
        transliteration: "Уляика 'аля худам-мир-Раббихим ва уляика хуму-ль-муфлихун"
      }
    ]
  },
  {
    id: 3,
    surahNumber: 3,
    nameArabic: "آل عمران",
    nameRussian: "Аль Имран (Семейство Имрана)",
    nameEnglish: "Ali 'Imran",
    versesCount: 200,
    revelationType: "Medinan",
    verses: [
      {
        id: 13,
        verseNumber: 1,
        textArabic: "الم",
        textRussian: "Алиф. Лям. Мим.",
        transliteration: "Алиф Лям Мим"
      },
      {
        id: 14,
        verseNumber: 2,
        textArabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        textRussian: "Аллах — нет божества, кроме Него, Живого, Вседержителя.",
        transliteration: "Аллаху ля иляха илля хува-ль-Хайю-ль-Каййум"
      },
      {
        id: 15,
        verseNumber: 3,
        textArabic: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ وَأَنزَلَ التَّوْرَاةَ وَالْإِنجِيلَ",
        textRussian: "Он ниспослал тебе Писание с истиной в подтверждение того, что было до него. Он ниспослал Таурат (Тору) и Инджил (Евангелие),",
        transliteration: "Наззаля 'аляйка-ль-китаба би-ль-хакки мусаддикан-лима байна йадайхи ва анзаля-т-Таурата ва-ль-Инджиль"
      },
      {
        id: 16,
        verseNumber: 4,
        textArabic: "مِن قَبْلُ هُدًى لِّلنَّاسِ وَأَنزَلَ الْفُرْقَانَ ۗ إِنَّ الَّذِينَ كَفَرُوا بِآيَاتِ اللَّهِ لَهُمْ عَذَابٌ شَدِيدٌ ۗ وَاللَّهُ عَزِيزٌ ذُو انتِقَامٍ",
        textRussian: "которые прежде были руководством для людей. Он также ниспослал Различение. Воистину, тем, которые не уверовали в знамения Аллаха, уготованы тяжкие мучения, ведь Аллах — Могущественный, Способный на возмездие.",
        transliteration: "Мин каблю худан-лин-наси ва анзаля-ль-Фуркан. Инна-ллязина кафару би-айати-Ллахи ляхум 'азабун шадид. Ва-Ллаху 'азизун зу-нтикам"
      },
      {
        id: 17,
        verseNumber: 5,
        textArabic: "إِنَّ اللَّهَ لَا يَخْفَىٰ عَلَيْهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ",
        textRussian: "Воистину, ничто не скрыто от Аллаха ни на земле, ни на небе.",
        transliteration: "Инна-Ллаха ля йахфа 'аляйхи шай'ун фи-ль-арды ва ля фи-с-сама"
      }
    ]
  },
  {
    id: 112,
    surahNumber: 112,
    nameArabic: "الإخلاص",
    nameRussian: "Аль-Ихлас (Очищение веры)",
    nameEnglish: "Al-Ikhlas",
    versesCount: 4,
    revelationType: "Meccan",
    verses: [
      {
        id: 18,
        verseNumber: 1,
        textArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        textRussian: "Скажи: «Он — Аллах Единый,",
        transliteration: "Куль хува-Ллаху ахад"
      },
      {
        id: 19,
        verseNumber: 2,
        textArabic: "اللَّهُ الصَّمَدُ",
        textRussian: "Аллах Самодостаточный.",
        transliteration: "Аллаху-с-Самад"
      },
      {
        id: 20,
        verseNumber: 3,
        textArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        textRussian: "Он не родил и не был рожден,",
        transliteration: "Лям йалид ва лям йуляд"
      },
      {
        id: 21,
        verseNumber: 4,
        textArabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        textRussian: "и нет никого, равного Ему».",
        transliteration: "Ва лям йакун-ляху куфуван ахад"
      }
    ]
  },
  {
    id: 113,
    surahNumber: 113,
    nameArabic: "الفلق",
    nameRussian: "Аль-Фаляк (Рассвет)",
    nameEnglish: "Al-Falaq",
    versesCount: 5,
    revelationType: "Meccan",
    verses: [
      {
        id: 22,
        verseNumber: 1,
        textArabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        textRussian: "Скажи: «Прибегаю к защите Господа рассвета",
        transliteration: "Куль а'узу би-Рабби-ль-фаляк"
      },
      {
        id: 23,
        verseNumber: 2,
        textArabic: "مِن شَرِّ مَا خَلَقَ",
        textRussian: "от зла того, что Он сотворил,",
        transliteration: "Мин шарри ма халяк"
      },
      {
        id: 24,
        verseNumber: 3,
        textArabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        textRussian: "от зла мрака, когда он наступает,",
        transliteration: "Ва мин шарри гасикын иза вакаб"
      },
      {
        id: 25,
        verseNumber: 4,
        textArabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        textRussian: "от зла колдуний, дующих на узлы,",
        transliteration: "Ва мин шарри-н-наффасати фи-ль-'укад"
      },
      {
        id: 26,
        verseNumber: 5,
        textArabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        textRussian: "от зла завистника, когда он завидует».",
        transliteration: "Ва мин шарри хасидин иза хасад"
      }
    ]
  },
  {
    id: 114,
    surahNumber: 114,
    nameArabic: "الناس",
    nameRussian: "Ан-Нас (Люди)",
    nameEnglish: "An-Nas",
    versesCount: 6,
    revelationType: "Meccan",
    verses: [
      {
        id: 27,
        verseNumber: 1,
        textArabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        textRussian: "Скажи: «Прибегаю к защите Господа людей,",
        transliteration: "Куль а'узу би-Рабби-н-нас"
      },
      {
        id: 28,
        verseNumber: 2,
        textArabic: "مَلِكِ النَّاسِ",
        textRussian: "Царя людей,",
        transliteration: "Малики-н-нас"
      },
      {
        id: 29,
        verseNumber: 3,
        textArabic: "إِلَٰهِ النَّاسِ",
        textRussian: "Бога людей,",
        transliteration: "Иляхи-н-нас"
      },
      {
        id: 30,
        verseNumber: 4,
        textArabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        textRussian: "от зла искусителя исчезающего при поминании Аллаха,",
        transliteration: "Мин шарри-ль-васваси-ль-ханнас"
      },
      {
        id: 31,
        verseNumber: 5,
        textArabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        textRussian: "который наущает в груди людей,",
        transliteration: "Аллязи йувасвису фи судури-н-нас"
      },
      {
        id: 32,
        verseNumber: 6,
        textArabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        textRussian: "от джиннов и людей».",
        transliteration: "Мина-ль-джиннати ва-н-нас"
      }
    ]
  }
];

// Surah list for navigation (all 114 surahs)
export const surahList = [
  { number: 1, nameRussian: "Аль-Фатиха", nameArabic: "الفاتحة", verses: 7 },
  { number: 2, nameRussian: "Аль-Бакара", nameArabic: "البقرة", verses: 286 },
  { number: 3, nameRussian: "Аль Имран", nameArabic: "آل عمران", verses: 200 },
  { number: 4, nameRussian: "Ан-Ниса", nameArabic: "النساء", verses: 176 },
  { number: 5, nameRussian: "Аль-Маида", nameArabic: "المائدة", verses: 120 },
  { number: 6, nameRussian: "Аль-Анам", nameArabic: "الأنعام", verses: 165 },
  { number: 7, nameRussian: "Аль-Араф", nameArabic: "الأعراف", verses: 206 },
  { number: 8, nameRussian: "Аль-Анфаль", nameArabic: "الأنفال", verses: 75 },
  { number: 9, nameRussian: "Ат-Тауба", nameArabic: "التوبة", verses: 129 },
  { number: 10, nameRussian: "Юнус", nameArabic: "يونس", verses: 109 },
  // ... shortened for brevity, would include all 114 surahs
  { number: 112, nameRussian: "Аль-Ихлас", nameArabic: "الإخلاص", verses: 4 },
  { number: 113, nameRussian: "Аль-Фаляк", nameArabic: "الفلق", verses: 5 },
  { number: 114, nameRussian: "Ан-Нас", nameArabic: "الناس", verses: 6 },
];
