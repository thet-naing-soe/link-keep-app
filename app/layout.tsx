import type { Metadata } from 'next';
import { inter } from '@/lib/fonts';
import './globals.css';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'LinkKeep',
  description:
    'A modern, clean, and professional full-stack bookmark application built with Next.js 14, Shadcn UI, and more.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`${inter.variable} antialiased`)}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
