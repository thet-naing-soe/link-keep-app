'use client';

import { useBookmarkStore } from '@/lib/store/bookmark-store';

export default function BookmarkListDisplay() {
  const bookmarks = useBookmarkStore((state) => state.bookmarks);

  if (bookmarks.length === 0) {
    return null;
  }

  return (
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
          {bookmark.updatedAt && (
            <p className="text-xs text-muted-foreground">
              Last Updated: {new Date(bookmark.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
