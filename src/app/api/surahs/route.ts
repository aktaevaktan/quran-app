import { NextResponse } from 'next/server';
import { sampleSurahs, surahList } from '@/lib/quran-data';

export async function GET() {
  // In production, this would fetch from the database
  // For now, return sample data
  return NextResponse.json({
    success: true,
    data: {
      surahs: surahList,
      totalSurahs: 114,
      availableSurahs: sampleSurahs.length,
    },
  });
}
