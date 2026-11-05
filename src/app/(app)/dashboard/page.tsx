import Link from "next/link";
import { requireUser } from "@/lib/auth/current-user";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@/lib/tickets/constants";
import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from "@/lib/tickets/labels";
import { getTicketStats } from "@/lib/tickets/stats";

export default async function DashboardPage() {
  await requireUser();
  const stats = await getTicketStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Panel
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {stats.total} {stats.total === 1 ? "ticket" : "tickets"} en el
            sistema.
          </p>
        </div>
        <Link
          href="/tickets"
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Ver tickets
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Por estado
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {TICKET_STATUSES.map((status) => (
            <Link
              key={status}
              href={`/tickets?status=${status}`}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {TICKET_STATUS_LABELS[status]}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {stats.byStatus[status]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Por prioridad
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {TICKET_PRIORITIES.map((priority) => (
            <div
              key={priority}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {TICKET_PRIORITY_LABELS[priority]}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {stats.byPriority[priority]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
