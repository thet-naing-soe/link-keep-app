'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  type CreateBookmarkInput,
  createBookmarkSchema,
} from '@/lib/validators';
import { z } from 'zod';

export default function AddBookmarkForm() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData: CreateBookmarkInput = {
        title,
        url,
        description: description || undefined,
      };
      createBookmarkSchema.parse(formData);

      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newBookmark = await res.json();
        setSuccess('Bookmark added successfully!');
        setTitle('');
        setUrl('');
        setDescription('');
        // TODO: Later: Update the bookmark list on the page directly (without page refresh)
      } else {
        const errorData = await res.json();
        setError(
          errorData.message || 'Failed to add bookmark. Please try again.'
        );
      }
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred. Please check your input.');
      }
    } finally {
      setLoading(false);
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}

      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Title
        </label>
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
        <label
          htmlFor="url"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          URL
        </label>
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
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Description (Optional)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of the bookmark."
          rows={3}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Bookmark'}
      </Button>
    </form>
  );
}
