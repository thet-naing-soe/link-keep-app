'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (status === 'unauthenticated' || !session || !session.user) {
    return (
      <Button onClick={() => signIn('google')} variant="default">
        Sign in with GitHub
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || session.user.email || 'User Avatar'}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <p className="text-sm font-medium text-foreground">
        Signed in as {session.user?.name || session.user?.email}
      </p>
      <Button onClick={() => signOut()} variant="destructive">
        Sign Out
      </Button>
    </div>
  );
}
