"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPanelProps = {
  error: unknown;
  retry: () => void;
};

export function ErrorPanel({ error, retry }: ErrorPanelProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
        Error
      </p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Algo salió mal
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        No se pudo completar la operación. Puedes intentarlo de nuevo o volver
        al panel.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Reintentar
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
