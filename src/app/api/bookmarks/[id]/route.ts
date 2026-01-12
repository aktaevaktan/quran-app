import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE - удалить закладку
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const bookmarkId = parseInt(id, 10);
    
    if (isNaN(bookmarkId)) {
      return NextResponse.json(
        { success: false, error: 'Некорректный ID закладки' },
        { status: 400 }
      );
    }
    
    // Check if bookmark belongs to user
    const bookmark = await prisma.bookmark.findFirst({
      where: { 
        id: bookmarkId,
        userId: session.user.id,
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: 'Закладка не найдена' },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Закладка удалена',
    });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при удалении закладки' },
      { status: 500 }
    );
  }
}
