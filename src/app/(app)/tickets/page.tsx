import Link from "next/link";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/tickets/TicketBadges";
import { requireUser } from "@/lib/auth/current-user";
import { formatDate } from "@/lib/format";
import { listTickets } from "@/lib/tickets/service";

type TicketsPageProps = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  await requireUser();
  const query = await searchParams;
  const tickets = await listTickets({
    status: query.status,
    search: query.q,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Tickets
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} en el
            sistema
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Nuevo ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-950">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            No hay tickets todavía
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Cuando se cree el primer ticket aparecerá aquí.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="text-base font-semibold text-zinc-950 hover:underline dark:text-zinc-50"
                  >
                    {ticket.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {ticket.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                <span>{ticket.author.name}</span>
                <span>{formatDate(ticket.createdAt)}</span>
                <span>
                  {ticket._count.comments}{" "}
                  {ticket._count.comments === 1 ? "comentario" : "comentarios"}
                </span>
                <span>
                  {ticket.assignee
                    ? `Asignado a ${ticket.assignee.name}`
                    : "Sin asignar"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
