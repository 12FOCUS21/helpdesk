"use server";

import { redirect } from "next/navigation";
import { actionStateFromError } from "@/lib/action-state";
import type { ActionState } from "@/lib/form-state";
import { loginSchema, registerSchema } from "@/lib/validation";
import { clearSessionCookie, getSessionToken, setSessionCookie } from "./cookies";
import {
  authenticate,
  createSession,
  deleteSession,
  EmailInUseError,
  registerUser,
} from "./session";

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

export async function registerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return actionStateFromError(parsed.error);
  }

  let user: { id: string; name: string; email: string };

  try {
    user = await registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return { fieldErrors: { email: [error.message] } };
    }

    return actionStateFromError(error);
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
