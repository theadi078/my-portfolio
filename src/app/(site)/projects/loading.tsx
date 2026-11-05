import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="shell py-16">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />
      <Skeleton className="mt-8 h-10 w-full max-w-sm rounded-btn" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
