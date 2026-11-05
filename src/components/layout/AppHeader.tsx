import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";
import type { SessionUser } from "@/lib/auth/session";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-16 w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
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
            <Link
              href="/tickets/new"
              className="rounded-md px-3 py-2 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              Nuevo ticket
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-right sm:block">
            <span className="block font-medium text-zinc-900 dark:text-zinc-100">
              {user.name}
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
