// Prayer Time Calculation Utilities
// Based on astronomical calculations for Islamic prayer times

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Calculation methods
const calculationMethods: Record<string, { fajrAngle: number; ishaAngle: number }> = {
  MWL: { fajrAngle: 18, ishaAngle: 17 }, // Muslim World League
  ISNA: { fajrAngle: 15, ishaAngle: 15 }, // Islamic Society of North America
  Egypt: { fajrAngle: 19.5, ishaAngle: 17.5 }, // Egyptian General Authority
  Makkah: { fajrAngle: 18.5, ishaAngle: 90 }, // Umm Al-Qura, Makkah (90 min after Maghrib)
  Karachi: { fajrAngle: 18, ishaAngle: 18 }, // University of Islamic Sciences, Karachi
  Tehran: { fajrAngle: 17.7, ishaAngle: 14 }, // Institute of Geophysics, Tehran
  Russia: { fajrAngle: 16, ishaAngle: 15 }, // Spiritual Administration of Muslims of Russia
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function fixAngle(angle: number): number {
  return angle - 360 * Math.floor(angle / 360);
}

function fixHour(hour: number): number {
  return hour - 24 * Math.floor(hour / 24);
}

// Calculate sun position
function sunPosition(jd: number): { declination: number; equation: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const RA = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))) / 15;
  const declination = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
  const equation = q / 15 - fixHour(RA);
  return { declination, equation };
}

// Julian date from Gregorian date
function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Compute time for a given angle
function computeTime(
  angle: number,
  time: number,
  latitude: number,
  declination: number,
  direction: 'ccw' | 'cw'
): number {
  const D = toDegrees(
    Math.acos(
      (-Math.sin(toRadians(angle)) - Math.sin(toRadians(latitude)) * Math.sin(toRadians(declination))) /
        (Math.cos(toRadians(latitude)) * Math.cos(toRadians(declination)))
    )
  );
  return time + (direction === 'ccw' ? -D : D) / 15;
}

// Format time as HH:MM
function formatTime(time: number): string {
  if (isNaN(time)) return '--:--';
  time = fixHour(time + 0.5 / 60); // Add 0.5 minutes for rounding
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Main function to calculate prayer times
export function calculatePrayerTimes(
  date: Date,
  coordinates: Coordinates,
  method: string = 'Russia',
  timezone: number = new Date().getTimezoneOffset() / -60
): PrayerTimes {
  const { latitude, longitude } = coordinates;
  const { fajrAngle, ishaAngle } = calculationMethods[method] || calculationMethods.MWL;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDate(year, month, day) - longitude / (15 * 24);
  const { declination, equation } = sunPosition(jd + 0.5);

  // Transit time (Dhuhr)
  const transit = 12 + timezone - longitude / 15 - equation;

  // Sunrise and Sunset
  const sunrise = computeTime(0.833, transit, latitude, declination, 'ccw');
  const sunset = computeTime(0.833, transit, latitude, declination, 'cw');

  // Fajr
  const fajr = computeTime(fajrAngle, transit, latitude, declination, 'ccw');

  // Isha
  let isha: number;
  if (ishaAngle === 90) {
    // Makkah method: 90 minutes after Maghrib
    isha = sunset + 1.5;
  } else {
    isha = computeTime(ishaAngle, transit, latitude, declination, 'cw');
  }

  // Asr (Shafi'i method - shadow equals object length)
  const asrFactor = 1; // Shafi'i: 1, Hanafi: 2
  // Calculate the angle when shadow length = object length + shadow at noon
  const noonShadowAngle = Math.abs(latitude - declination);
  const asrShadowRatio = asrFactor + Math.tan(toRadians(noonShadowAngle));
  const asrAngle = toDegrees(Math.atan(1 / asrShadowRatio));
  
  // Calculate Asr time using the computed angle
  const asrTime = computeAsrTime(asrAngle, transit, latitude, declination);

  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(transit),
    asr: formatTime(asrTime),
    maghrib: formatTime(sunset),
    isha: formatTime(isha),
  };
}

// Special function for Asr calculation
function computeAsrTime(
  angle: number,
  transit: number,
  latitude: number,
  declination: number
): number {
  const cosAngle = Math.cos(toRadians(angle));
  const sinLat = Math.sin(toRadians(latitude));
  const cosLat = Math.cos(toRadians(latitude));
  const sinDec = Math.sin(toRadians(declination));
  const cosDec = Math.cos(toRadians(declination));
  
  const numerator = Math.sin(toRadians(angle)) - sinLat * sinDec;
  const denominator = cosLat * cosDec;
  
  if (Math.abs(denominator) < 0.0001) return NaN;
  
  const ratio = numerator / denominator;
  if (ratio > 1 || ratio < -1) return NaN;
  
  const hourAngle = toDegrees(Math.acos(ratio));
  return transit + hourAngle / 15;
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
export function getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string } | null {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'sunrise', time: prayerTimes.sunrise },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    if (prayerMinutes > currentTime) {
      return prayer;
    }
  }

  // If all prayers have passed, return Fajr of next day
  return prayers[0];
}
