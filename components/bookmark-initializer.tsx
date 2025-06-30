'use client';

import { useEffect, useRef } from 'react';
import { useBookmarkStore } from '@/lib/store/bookmark-store';
import type { Bookmark } from '@/types';

interface BookmarkInitializerProps {
  initialBookmarks: Bookmark[];
}

export default function BookmarkInitializer({
  initialBookmarks,
}: BookmarkInitializerProps) {
  const initialized = useRef(false);
  const setBookmarks = useBookmarkStore((state) => state.setBookmarks);

  useEffect(() => {
    if (!initialized.current) {
      setBookmarks(initialBookmarks);
      initialized.current = true;
    }
  }, [initialBookmarks, setBookmarks]);

  return null;
}
