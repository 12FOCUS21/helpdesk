export function TicketListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <ul className="space-y-3">
        {[0, 1, 2].map((index) => (
          <li
            key={index}
            className="h-32 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          />
        ))}
      </ul>
    </div>
  );
}
