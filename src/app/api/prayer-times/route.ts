import { NextResponse } from 'next/server';
import { calculatePrayerTimes } from '@/lib/prayer-times';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const dateStr = searchParams.get('date');
  
  if (!lat || !lon) {
    return NextResponse.json(
      { success: false, error: 'Координаты не указаны' },
      { status: 400 }
    );
  }
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const date = dateStr ? new Date(dateStr) : new Date();
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { success: false, error: 'Некорректные координаты' },
      { status: 400 }
    );
  }
  
  const prayerTimes = calculatePrayerTimes(date, { latitude, longitude });
  
  return NextResponse.json({
    success: true,
    data: {
      date: date.toISOString().split('T')[0],
      location: { latitude, longitude },
      times: prayerTimes,
    },
  });
}
