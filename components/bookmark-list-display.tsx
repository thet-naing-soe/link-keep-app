'use client';

import Img from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Bookmark } from '@/types';
import { useSession } from 'next-auth/react';
import { Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/lib/store/notification-store';
import { useConfirmStore } from '@/lib/store/confirm-store';
import { BookmarkSkeletonList } from './bookmark-skeleton-list';

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
      .catch(() => ({ message: 'Unknown Error' }));
    throw new Error(errorData.message || 'Failed to delete bookmark');
  }
  return res.json();
};

export default function BookmarkListDisplay() {
  const { data: session, status: sessionStatus } = useSession();

  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );
  const showConfirm = useConfirmStore((state) => state.showConfirm);
  const {
    data: bookmarks,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Bookmark[], Error>({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    enabled: sessionStatus === 'authenticated',
  });

  const { mutate: deleteBookmarkMutate, isPending: isDeleting } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      showNotification('Bookmark deleted successfully!', 'success');
    },
    onError: (err) => {
      showNotification(
        err.message || 'Failed to delete bookmark. Please try again later.',
        'error'
      );
    },
  });

  const handleDelete = (bookmarkId: string) => {
    showConfirm(
      'Confirm Deletion',
      'Are you sure you want to delete this bookmark? This action cannot be undone.',
      () => deleteBookmarkMutate(bookmarkId)
    );
  };
  if (sessionStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-center text-muted-foreground">Loading session...</p>
      </div>
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
    return <BookmarkSkeletonList count={3} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold text-destructive">
          Oops! Something went wrong.
        </p>
        <p className="text-center text-destructive">
          Error: {error?.message || 'Failed to load bookmarks.'}
        </p>
        <Button onClick={() => refetch()} className="mt-4" disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Img
          src="/empty-state.svg"
          alt="No bookmarks"
          width={96}
          height={96}
          className="mb-4 text-muted-foreground"
        />
        <h3 className="text-xl font-semibold text-foreground">
          No Bookmarks Yet!
        </h3>
        <p className="mt-2 text-muted-foreground">
          It looks like you haven&apos;t saved any links. Start by adding one
          above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex items-start justify-between rounded-md border bg-card p-4 shadow-sm"
        >
          <div className="flex-grow">
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
                Last Updated:{' '}
                {new Date(bookmark.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(bookmark.id)}
            disabled={isDeleting}
            className="ml-4 flex-shrink-0"
          >
            {isDeleting ? (
              <Trash2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete bookmark</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
