import type { Metadata } from "next";
import Link from "next/link";
import { TicketForm } from "@/components/tickets/TicketForm";
import { requireUser } from "@/lib/auth/current-user";
import { createTicketAction } from "@/lib/tickets/actions";

export const metadata: Metadata = {
  title: "Nuevo ticket — HelpDesk",
};

export default async function NewTicketPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/tickets"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Volver a tickets
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Nuevo ticket
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Describe el problema con el mayor detalle posible.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <TicketForm
          action={createTicketAction}
          submitLabel="Crear ticket"
          cancelHref="/tickets"
        />
      </div>
    </div>
  );
}
