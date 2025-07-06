'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import QueryProvider from '@/components/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
