export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Proyecto de aprendizaje
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          HelpDesk
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Sistema de tickets de soporte. Un MVP para practicar el ciclo completo
          de ingeniería de software con asistencia de IA: planificar, construir,
          revisar, probar y documentar.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Semana
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              1 / 8
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Estado
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Setup
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Stack
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Next.js
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
