import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          HelpDesk
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Inicia sesión
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Gestiona las incidencias de soporte de tu equipo.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <LoginForm />
      </div>

      {process.env.NODE_ENV !== "production" ? (
        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Cuenta de prueba: agente@helpdesk.dev / password123
        </p>
      ) : null}
    </div>
  );
}
