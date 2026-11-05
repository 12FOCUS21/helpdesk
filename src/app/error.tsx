"use client";

import { ErrorPanel } from "@/components/ui/ErrorPanel";

export default function RootError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <ErrorPanel error={error} retry={retry} />
    </main>
  );
}
