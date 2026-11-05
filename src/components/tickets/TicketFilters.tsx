import Link from "next/link";
import { TICKET_STATUSES } from "@/lib/tickets/constants";
import { TICKET_STATUS_LABELS } from "@/lib/tickets/labels";

type TicketFiltersProps = {
  status?: string;
  q?: string;
};

const inputClass =
  "mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800";

const labelClass =
  "block text-sm font-medium text-zinc-900 dark:text-zinc-100";

export function TicketFilters({ status, q }: TicketFiltersProps) {
  const hasFilters = Boolean(status || q);

  return (
    <form
      method="get"
      action="/tickets"
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="q" className={labelClass}>
          Buscar
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Título o descripción"
          className={inputClass}
        />
      </div>

      <div className="sm:w-48">
        <label htmlFor="status" className={labelClass}>
          Estado
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status ?? ""}
          className={inputClass}
        >
          <option value="">Todos</option>
          {TICKET_STATUSES.map((value) => (
            <option key={value} value={value}>
              {TICKET_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Filtrar
        </button>
        {hasFilters ? (
          <Link
            href="/tickets"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Limpiar
          </Link>
        ) : null}
      </div>
    </form>
  );
}
