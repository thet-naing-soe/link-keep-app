export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
