import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteTicketForm } from "@/components/tickets/DeleteTicketForm";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/tickets/TicketBadges";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { requireUser } from "@/lib/auth/current-user";
import { formatDate } from "@/lib/format";
import { addCommentAction, changeStatusAction } from "@/lib/tickets/actions";
import { canTransition } from "@/lib/tickets/status";
import { getTicket, TicketNotFoundError } from "@/lib/tickets/service";

export const metadata: Metadata = {
  title: "Detalle del ticket — HelpDesk",
};

type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  estado: "No se pudo cambiar el estado del ticket.",
  comentario: "No se pudo añadir el comentario.",
  eliminar: "No se pudo eliminar el ticket.",
};

const inputClass =
  "mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800";

export default async function TicketDetailPage({
  params,
  searchParams,
}: TicketDetailPageProps) {
  await requireUser();
  const { id } = await params;
  const query = await searchParams;

  const ticket = await getTicket(id).catch((error: unknown) => {
    if (error instanceof TicketNotFoundError) {
      notFound();
    }
    throw error;
  });

  const errorMessage = query.error ? ERROR_MESSAGES[query.error] : undefined;

  return (
    <div className="space-y-6">
      <Link
        href="/tickets"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Volver a tickets
      </Link>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {errorMessage}
        </p>
      ) : null}

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {canTransition(ticket.status, "en_progreso") ? (
              <form action={changeStatusAction}>
                <input type="hidden" name="ticketId" value={ticket.id} />
                <input type="hidden" name="status" value="en_progreso" />
                <SubmitButton pendingText="Actualizando...">
                  Iniciar progreso
                </SubmitButton>
              </form>
            ) : null}

            {canTransition(ticket.status, "cerrado") ? (
              <form action={changeStatusAction}>
                <input type="hidden" name="ticketId" value={ticket.id} />
                <input type="hidden" name="status" value="cerrado" />
                <SubmitButton pendingText="Actualizando...">
                  Cerrar ticket
                </SubmitButton>
              </form>
            ) : null}

            {canTransition(ticket.status, "abierto") ? (
              <form action={changeStatusAction}>
                <input type="hidden" name="ticketId" value={ticket.id} />
                <input type="hidden" name="status" value="abierto" />
                <SubmitButton variant="secondary" pendingText="Actualizando...">
                  Reabrir ticket
                </SubmitButton>
              </form>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/tickets/${ticket.id}/edit`}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Editar
            </Link>
            <DeleteTicketForm ticketId={ticket.id} />
          </div>
        </div>
      </section>

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

        <form action={addCommentAction} className="mt-6 space-y-2">
          <input type="hidden" name="ticketId" value={ticket.id} />
          <label
            htmlFor="body"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Añadir comentario
          </label>
          <textarea
            id="body"
            name="body"
            required
            maxLength={1000}
            rows={3}
            placeholder="Escribe una respuesta..."
            className={inputClass}
          />
          <SubmitButton pendingText="Publicando...">
            Publicar comentario
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}
