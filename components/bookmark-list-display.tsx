'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Bookmark } from '@/types';
import { useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fetchBookmarks = async (): Promise<Bookmark[]> => {
  const res = await fetch('/api/bookmarks');
  if (!res.ok) {
    throw new Error('Failed to fetch bookmarks');
  }
  const data: Bookmark[] = await res.json();
  return data;
};

const deleteBookmark = async (bookmarkId: string) => {
  const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: 'Unknow Error' }));
    throw new Error(errorData.message || 'Failed to delete bookmark');
  }
  return res.json();
};

export default function BookmarkListDisplay() {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const {
    data: bookmarks,
    isLoading,
    isError,
    error,
  } = useQuery<Bookmark[], Error>({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    enabled: sessionStatus === 'authenticated',
  });

  const {
    mutate: deleteBookmarkMutate,
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    error: deleteError,
  } = useMutation<void, Error, string>({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (err) => {
      console.error('Error deleting bookmark:', err);
      alert(
        err.message || 'Failed to delete bookmark. Please try again later.'
      );
    },
  });

  if (sessionStatus === 'loading') {
    return (
      <p className="text-center text-muted-foreground">Loading session...</p>
    );
  }

  if (sessionStatus === 'unauthenticated' || !session?.user?.id) {
    return (
      <p className="mt-8 text-center text-lg text-muted-foreground">
        Please sign in to view your bookmarks.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">Loading bookmarks...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">
        Error: {error?.message || 'Failed to load bookmarks.'}
      </p>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet. Sign in and add some!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {isDeleteError && (
        <p className="text-center text-sm text-blue-500">
          Deleting bookmark...
        </p>
      )}
      {isDeleteError && (
        <p className="text-center text-sm text-destructive">
          Error deleting: {deleteError.message}
        </p>
      )}
      {isDeleteSuccess && (
        <p className="text-center text-sm text-green-500">
          Bookmark deleted successfully!
        </p>
      )}
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
          <Button
            variant="destructive"
            size="icon"
            onClick={() => deleteBookmarkMutate(bookmark.id)}
            disabled={isDeleting}
            className="ml-4 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete bookmark</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
