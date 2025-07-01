'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  type CreateBookmarkInput,
  createBookmarkSchema,
} from '@/lib/validators';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark } from '@prisma/client';

const createBookmark = async (newBookmarkData: CreateBookmarkInput) => {
  const res = await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBookmarkData),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: 'Failed to create bookmark' }));
    throw new Error(errorData.message || 'Failed to create bookmark');
  }
  return res.json();
};

export default function AddBookmarkForm() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    isError: isMutationError,
    isSuccess: isMutationSuccess,
    error: mutationError,
  } = useMutation<Bookmark, Error, CreateBookmarkInput>({
    mutationFn: createBookmark,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      setTitle('');
      setUrl('');
      setDescription('');
      setError('');
    },
    onError: (err) => {
      setError(
        err.message || 'Failed to add bookmark via API. Please try again.'
      );
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formData: CreateBookmarkInput = {
        title,
        url,
        description: description || undefined,
      };
      createBookmarkSchema.parse(formData);
      mutate(formData);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred. Please check your input.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border bg-card p-6 shadow-md"
    >
      <h2 className="text-2xl font-semibold text-card-foreground">
        Add New Bookmark
      </h2>
      {(error || isMutationError) && (
        <p className="text-sm text-destructive">
          {error || mutationError?.message || 'Failed to add bookmark.'}
        </p>
      )}
      {isMutationSuccess && (
        <p className="text-sm text-green-500">Bookmark added successfully!</p>
      )}

      <div>
        <Label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Title
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Next.js Docs"
          required
        />
      </div>
      <div>
        <Label
          htmlFor="url"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          URL
        </Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., https://nextjs.org/docs"
          required
        />
      </div>
      <div>
        <Label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of the bookmark."
          rows={3}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add Bookmark'}
      </Button>
    </form>
  );
}
