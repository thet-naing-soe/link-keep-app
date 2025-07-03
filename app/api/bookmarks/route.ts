import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBookmarkSchema } from '@/lib/validators';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const validatedData = createBookmarkSchema.parse(body);

    const newBookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        url: validatedData.url,
        description: validatedData.description,
      },
    });

    return NextResponse.json(newBookmark, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }
    console.error('Error creating bookmark:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookmarks);
  } catch (error: unknown) {
    console.error('Error fetching bookmarks:', error);
    return new NextResponse(
      'Failed to fetch bookmarks due to a server error.',
      { status: 500 }
    );
  }
}
