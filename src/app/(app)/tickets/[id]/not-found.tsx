import Link from "next/link";

export default function TicketNotFound() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-950">
      <h1 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Ticket no encontrado
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        El ticket que buscas no existe o fue eliminado.
      </p>
      <Link
        href="/tickets"
        className="mt-4 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Volver a tickets
      </Link>
    </div>
  );
}
