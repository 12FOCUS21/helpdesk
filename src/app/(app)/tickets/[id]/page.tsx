import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/tickets/TicketBadges";
import { formatDate } from "@/lib/format";
import { getTicket, TicketNotFoundError } from "@/lib/tickets/service";

type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { id } = await params;

  const ticket = await getTicket(id).catch((error: unknown) => {
    if (error instanceof TicketNotFoundError) {
      notFound();
    }
    throw error;
  });

  return (
    <div className="space-y-6">
      <Link
        href="/tickets"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Volver a tickets
      </Link>

      <article className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {ticket.title}
          </h1>
          <div className="flex shrink-0 flex-wrap gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-y border-zinc-200 py-4 text-sm dark:border-zinc-800 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Autor
            </dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
              {ticket.author.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Asignado
            </dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
              {ticket.assignee?.name ?? "Sin asignar"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Creado
            </dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
              {formatDate(ticket.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Actualizado
            </dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
              {formatDate(ticket.updatedAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Descripción
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {ticket.description}
          </p>
        </div>
      </article>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Comentarios
        </h2>

        {ticket.comments.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Todavía no hay comentarios en este ticket.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {ticket.comments.map((comment) => (
              <li
                key={comment.id}
                className="border-l-2 border-zinc-200 pl-4 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {comment.author.name}
                  </span>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {comment.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
