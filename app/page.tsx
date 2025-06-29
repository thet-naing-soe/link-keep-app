import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import LoginButton from '@/components/login-button';
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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to LinkKeep
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A modern, clean, and professional full-stack application.
          </p>
          <div className="mt-8">
            <Button size="lg">Get Started</Button>
          </div>
        </div>
        {session?.user?.id ? (
          <section className="mt-8 w-full max-w-2xl px-4">
            <h2 className="mb-4 text-center text-2xl font-semibold">
              Your Saved Links
            </h2>
            {bookmarks.length > 0 ? (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="rounded-md border bg-card p-4 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {bookmark.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {bookmark.description || 'No description.'}
                    </p>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-primary hover:underline"
                    >
                      {bookmark.url}
                    </a>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Saved: {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last Updated:
                      {new Date(bookmark.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
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
