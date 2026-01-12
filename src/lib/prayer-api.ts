// Prayer Times API Service
// Uses Aladhan API for accurate prayer times

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface AladhanResponse {
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      hijri: {
        date: string;
        month: { en: string; ar: string };
        year: string;
      };
    };
  };
}

// Fetch prayer times from Aladhan API
export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  date?: Date
): Promise<PrayerTimesData | null> {
  try {
    const d = date || new Date();
    const dateStr = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    
    // Method 14 = Духовное управление мусульман России
    // school=1 = Ханафитский мазхаб (тень объекта = 2 длины объекта)
    // school=0 = Шафиитский мазхаб (тень объекта = 1 длина объекта) - по умолчанию
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=14&school=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data: AladhanResponse = await response.json();
    
    return {
      fajr: data.data.timings.Fajr.substring(0, 5),
      sunrise: data.data.timings.Sunrise.substring(0, 5),
      dhuhr: data.data.timings.Dhuhr.substring(0, 5),
      asr: data.data.timings.Asr.substring(0, 5),
      maghrib: data.data.timings.Maghrib.substring(0, 5),
      isha: data.data.timings.Isha.substring(0, 5),
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

// Get Hijri date
export async function fetchHijriDate(
  latitude: number,
  longitude: number
): Promise<{ date: string; month: string; year: string } | null> {
  try {
    const d = new Date();
    const dateStr = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=14`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch hijri date');
    }
    
    const data: AladhanResponse = await response.json();
    
    return {
      date: data.data.date.hijri.date,
      month: data.data.date.hijri.month.ar,
      year: data.data.date.hijri.year,
    };
  } catch (error) {
    console.error('Error fetching hijri date:', error);
    return null;
  }
}

// Get prayer name in Russian
export function getPrayerNameRu(prayer: string): string {
  const names: Record<string, string> = {
    fajr: 'Фаджр',
    sunrise: 'Восход',
    dhuhr: 'Зухр',
    asr: 'Аср',
    maghrib: 'Магриб',
    isha: 'Иша',
  };
  return names[prayer] || prayer;
}

// Get next prayer
export function getNextPrayer(times: PrayerTimesData): { name: string; time: string } | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'fajr', time: times.fajr },
    { name: 'sunrise', time: times.sunrise },
    { name: 'dhuhr', time: times.dhuhr },
    { name: 'asr', time: times.asr },
    { name: 'maghrib', time: times.maghrib },
    { name: 'isha', time: times.isha },
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    if (prayerMinutes > currentMinutes) {
      return prayer;
    }
  }
  
  // If all prayers passed, return Fajr (next day)
  return { name: 'fajr', time: times.fajr };
}
