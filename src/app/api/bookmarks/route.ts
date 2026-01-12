import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - получить все закладки пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении закладок' },
      { status: 500 }
    );
  }
}

// POST - создать новую закладку
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { surahId, verseNumber, surahName, verseText, note } = body;
    
    if (!surahId || !verseNumber) {
      return NextResponse.json(
        { success: false, error: 'Не указаны обязательные поля' },
        { status: 400 }
      );
    }
    
    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_surahId_verseNumber: {
          userId: session.user.id,
          surahId,
          verseNumber,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { success: false, error: 'Закладка уже существует' },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        surahId,
        verseNumber,
        surahName: surahName || '',
        verseText: verseText || '',
        note: note || null,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при создании закладки' },
      { status: 500 }
    );
  }
}

// DELETE - удалить закладку
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { surahId, verseNumber } = body;
    
    if (!surahId || !verseNumber) {
      return NextResponse.json(
        { success: false, error: 'Не указаны обязательные поля' },
        { status: 400 }
      );
    }

    await prisma.bookmark.delete({
      where: {
        userId_surahId_verseNumber: {
          userId: session.user.id,
          surahId,
          verseNumber,
        },
      },
    });
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при удалении закладки' },
      { status: 500 }
    );
  }
}
