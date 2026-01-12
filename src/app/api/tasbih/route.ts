import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

// GET - получить текущий счётчик тасбиха
export async function GET() {
  try {
    const today = getTodayDate();
    
    let tasbih = await prisma.tasbihCount.findUnique({
      where: { date: today }
    });
    
    // Если записи за сегодня нет, создаём
    if (!tasbih) {
      tasbih = await prisma.tasbihCount.create({
        data: {
          date: today,
          subhanallah: 0,
          alhamdulillah: 0,
          allahuakbar: 0,
          lailaha: 0,
          astaghfirullah: 0,
          salawat: 0,
          totalCount: 0
        }
      });
    }
    
    return NextResponse.json(tasbih);
  } catch (error) {
    console.error('Error fetching tasbih:', error);
    return NextResponse.json({ error: 'Failed to fetch tasbih' }, { status: 500 });
  }
}

// POST - обновить счётчик
export async function POST(request: NextRequest) {
  try {
    const { type, action } = await request.json();
    const today = getTodayDate();
    
    // Валидация типа
    const validTypes = ['subhanallah', 'alhamdulillah', 'allahuakbar', 'lailaha', 'astaghfirullah', 'salawat'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid tasbih type' }, { status: 400 });
    }
    
    // Получаем или создаём запись за сегодня
    let tasbih = await prisma.tasbihCount.findUnique({
      where: { date: today }
    });
    
    if (!tasbih) {
      tasbih = await prisma.tasbihCount.create({
        data: {
          date: today,
          subhanallah: 0,
          alhamdulillah: 0,
          allahuakbar: 0,
          lailaha: 0,
          astaghfirullah: 0,
          salawat: 0,
          totalCount: 0
        }
      });
    }
    
    // Обновляем счётчик
    const updateData: Record<string, number> = {};
    
    if (action === 'increment') {
      updateData[type] = (tasbih[type as keyof typeof tasbih] as number) + 1;
      updateData.totalCount = tasbih.totalCount + 1;
    } else if (action === 'reset') {
      updateData[type] = 0;
    } else if (action === 'resetAll') {
      updateData.subhanallah = 0;
      updateData.alhamdulillah = 0;
      updateData.allahuakbar = 0;
      updateData.lailaha = 0;
      updateData.astaghfirullah = 0;
      updateData.salawat = 0;
      updateData.totalCount = 0;
    }
    
    const updatedTasbih = await prisma.tasbihCount.update({
      where: { date: today },
      data: updateData
    });
    
    return NextResponse.json(updatedTasbih);
  } catch (error) {
    console.error('Error updating tasbih:', error);
    return NextResponse.json({ error: 'Failed to update tasbih' }, { status: 500 });
  }
}
