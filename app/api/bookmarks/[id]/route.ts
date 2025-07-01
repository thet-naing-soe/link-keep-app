import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const bookmarkId = context.params.id;

    const bookmarkToDelete = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmarkToDelete) {
      return NextResponse.json(
        { message: 'Bookmark not found.' },
        { status: 404 }
      );
    }

    if (bookmarkToDelete.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You do not own this bookmark.' },
        {
          status: 403,
        }
      );
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { message: 'Failed to delete bookmark due to a server error.' },
      { status: 500 }
    );
  }
}
