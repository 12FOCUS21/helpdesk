"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/form-state";
import { loginSchema } from "@/lib/validation";
import { clearSessionCookie, getSessionToken, setSessionCookie } from "./cookies";
import { authenticate, createSession, deleteSession } from "./session";

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const user = await authenticate(parsed.data.email, parsed.data.password);

  if (!user) {
    return { error: "Correo o contraseña incorrectos" };
  }

  const session = await createSession(user.id);
  await setSessionCookie(session.token, session.expiresAt);

  redirect("/dashboard");
}

export async function logoutAction() {
  const token = await getSessionToken();

  if (token) {
    await deleteSession(token);
  }

  await clearSessionCookie();
  redirect("/login");
}
