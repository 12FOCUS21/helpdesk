import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketForm } from "@/components/tickets/TicketForm";
import { requireUser } from "@/lib/auth/current-user";
import { updateTicketAction } from "@/lib/tickets/actions";
import { getTicket, TicketNotFoundError } from "@/lib/tickets/service";

type EditTicketPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTicketPage({ params }: EditTicketPageProps) {
  await requireUser();
  const { id } = await params;

  const ticket = await getTicket(id).catch((error: unknown) => {
    if (error instanceof TicketNotFoundError) {
      notFound();
    }
    throw error;
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/tickets/${ticket.id}`}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Volver al ticket
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Editar ticket
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Actualiza el título, la descripción o la prioridad.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <TicketForm
          action={updateTicketAction.bind(null, ticket.id)}
          initialValues={{
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
          }}
          submitLabel="Guardar cambios"
          cancelHref={`/tickets/${ticket.id}`}
        />
      </div>
    </div>
  );
}
