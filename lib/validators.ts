import { z } from 'zod';

export const createBookmarkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .max(100, 'Title must be 100 characters or less.'),
  url: z.string().url('Please enter a valid URL.'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less.')
    .optional(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
