'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import LoginButton from '@/components/login-button';
import type { Bookmark } from '@/types';

export default function HomePage() {
  const exampleBookmark: Bookmark = {
    id: 'clxkjqwer12345',
    title: 'The Ultimate Guide to Next.js',
    url: 'https://nextjs.org/docs',
    description: 'The official Next.js documentation.',
    createdAt: new Date().toISOString(),
  };

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

        <div className="mt-8 w-full max-w-md rounded-md border bg-muted p-4">
          <p className="text-sm font-medium">Example Type in Action:</p>
          <pre
            suppressHydrationWarning
            className="mt-2 overflow-x-auto rounded-sm bg-background p-2 text-xs"
          >
            <code>{JSON.stringify(exampleBookmark, null, 2)}</code>
          </pre>
        </div>
      </main>
    </>
  );
}
