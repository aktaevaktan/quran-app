import { NextResponse } from 'next/server';
import { sampleSurahs } from '@/lib/quran-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const surahId = parseInt(id, 10);
  
  // In production, fetch from database
  const surah = sampleSurahs.find((s) => s.id === surahId);
  
  if (!surah) {
    return NextResponse.json(
      { success: false, error: 'Сура не найдена' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: surah,
  });
}
