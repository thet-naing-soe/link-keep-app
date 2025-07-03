import { Skeleton } from '@/components/ui/skeleton';

interface BookmarkSkeletonListProps {
  count?: number;
}

export function BookmarkSkeletonList({ count = 3 }: BookmarkSkeletonListProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-start justify-between rounded-md border bg-card p-4 shadow-sm"
        >
          <div className="flex-grow space-y-2">
            <Skeleton className="h-6 w-3/4" /> {/* Title Skeleton */}
            <Skeleton className="h-4 w-full" /> {/* Description Skeleton */}
            <Skeleton className="h-4 w-1/2" /> {/* URL Skeleton */}
            <Skeleton className="h-3 w-1/4" /> {/* Date Skeleton */}
          </div>
          <Skeleton className="ml-4 h-10 w-10 rounded-md" />{' '}
          {/* Button Skeleton */}
        </div>
      ))}
    </div>
  );
}
