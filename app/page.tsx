import { ThemeToggle } from '@/components/theme-toggle';
import LoginButton from '@/components/login-button';
import AddBookmarkForm from '@/components/add-bookmark-form';
import BookmarkInitializer from '@/components/bookmark-initializer';
import BookmarkListDisplay from '@/components/bookmark-list-display';

import type { Bookmark } from '@/types';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export default async function HomePage() {
  const session = await auth();
  let bookmarks: Bookmark[] = [];

  if (session?.user?.id) {
    bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return (
    <>
      <header className="absolute right-4 top-4 z-10 flex items-center gap-4">
        <LoginButton />
        <ThemeToggle />
      </header>
      <BookmarkInitializer initialBookmarks={bookmarks} />
      <main className="flex min-h-screen flex-col items-center justify-center py-12">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to LinkKeep
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A modern, clean, and professional full-stack application.
          </p>
        </div>

        {session?.user?.id && (
          <div className="mb-12 w-full max-w-lg">
            <AddBookmarkForm />
          </div>
        )}

        {session?.user?.id ? (
          <section className="mt-8 w-full max-w-2xl px-4">
            <h2 className="mb-4 text-center text-2xl font-semibold">
              Your Saved Links
            </h2>
            {bookmarks.length > 0 ? (
              <BookmarkListDisplay />
            ) : (
              <p className="text-center text-muted-foreground">
                You don&apos;t have any bookmarks yet. Sign in and add some!
              </p>
            )}
          </section>
        ) : (
          <p className="mt-8 text-center text-lg text-muted-foreground">
            Please sign in to view your bookmarks.
          </p>
        )}
      </main>
    </>
  );
}
