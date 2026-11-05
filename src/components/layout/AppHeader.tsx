import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/tickets"
          className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          HelpDesk
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/tickets"
            className="rounded-md px-3 py-2 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            Tickets
          </Link>
        </nav>
      </div>
    </header>
  );
}
