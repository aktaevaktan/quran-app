// Hijri (Islamic) Calendar Utilities

const HIJRI_MONTHS = [
  'Мухаррам',
  'Сафар',
  'Раби аль-Авваль',
  'Раби ас-Сани',
  'Джумада аль-Уля',
  'Джумада ас-Сани',
  'Раджаб',
  'Шаабан',
  'Рамадан',
  'Шавваль',
  'Зуль-Каада',
  'Зуль-Хиджа'
];

const WEEKDAYS_RU = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота'
];

const WEEKDAYS_SHORT_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
}

/**
 * Convert Gregorian date to Hijri (approximate algorithm)
 * For precise dates, use Aladhan API
 */
export function gregorianToHijri(date: Date): HijriDate {
  const jd = gregorianToJulian(date);
  return julianToHijri(jd);
}

function gregorianToJulian(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function julianToHijri(jd: number): HijriDate {
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) + Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
  const l2 = l1 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return {
    day,
    month,
    monthName: HIJRI_MONTHS[month - 1] || '',
    year,
    formatted: `${day} ${HIJRI_MONTHS[month - 1] || ''}, ${year} г.х.`
  };
}

/**
 * Get Hijri date from Aladhan API (more accurate)
 */
export async function getHijriDateFromAPI(date: Date): Promise<HijriDate | null> {
  try {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    const response = await fetch(
      `https://api.aladhan.com/v1/gpigregorianToHijri/${day}-${month}-${year}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const hijri = data.data;
    
    return {
      day: parseInt(hijri.day),
      month: parseInt(hijri.month.number),
      monthName: HIJRI_MONTHS[parseInt(hijri.month.number) - 1],
      year: parseInt(hijri.year),
      formatted: `${hijri.day} ${HIJRI_MONTHS[parseInt(hijri.month.number) - 1]}, ${hijri.year} г.х.`
    };
  } catch {
    return null;
  }
}

export function getWeekdayName(date: Date, short = false): string {
  return short ? WEEKDAYS_SHORT_RU[date.getDay()] : WEEKDAYS_RU[date.getDay()];
}

export function formatGregorianDate(date: Date): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export { HIJRI_MONTHS, WEEKDAYS_RU, WEEKDAYS_SHORT_RU };
