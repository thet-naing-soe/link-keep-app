'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  type CreateBookmarkInput,
  createBookmarkSchema,
} from '@/lib/validators';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotificationStore } from '@/lib/store/notification-store';

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
  const form = useForm<CreateBookmarkInput>({
    resolver: zodResolver(createBookmarkSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
    },
  });

  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  const { mutate, isPending } = useMutation<
    Bookmark,
    Error,
    CreateBookmarkInput
  >({
    mutationFn: createBookmark,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      form.reset();
      showNotification('Bookmark added successfully!', 'success');
    },
    onError: (err) => {
      showNotification(
        err.message || 'Failed to add bookmark via API. Please try again.',
        'error'
      );
    },
  });

  const onSubmit = (data: CreateBookmarkInput) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border bg-card p-6 shadow-md"
      >
        <h2 className="text-2xl font-semibold text-card-foreground">
          Add New Bookmark
        </h2>

        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g., Next.js Docs"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL Field */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="e.g., https://nextjs.org/docs"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the bookmark."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Bookmark'}
        </Button>
      </form>
    </Form>
  );
}
