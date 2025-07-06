import type { Metadata } from 'next';
import { inter } from '@/lib/fonts';
import './globals.css';

import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';

import { Toaster } from '@/components/ui/sonner';
import { ConfirmationDialog } from '@/components/confirmation-dialog';

export const metadata: Metadata = {
  title: 'LinkKeep',
  description:
    'A modern, clean, and professional full-stack bookmark application built with Next.js 14, Shadcn UI, and more.',
  icons: {
    icon: [
      {
        url: '/bookmark-icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`${inter.variable} antialiased`)}>
        <Providers>{children}</Providers>
        <Toaster />
        <ConfirmationDialog />
      </body>
    </html>
  );
}
