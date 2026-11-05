"use client";

import { deleteTicketAction } from "@/lib/tickets/actions";

export function DeleteTicketForm({ ticketId }: { ticketId: string }) {
  return (
    <form
      action={deleteTicketAction}
      onSubmit={(event) => {
        if (!window.confirm("¿Eliminar este ticket y todos sus comentarios?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="ticketId" value={ticketId} />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        Eliminar
      </button>
    </form>
  );
}
