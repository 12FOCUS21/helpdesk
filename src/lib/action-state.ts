import { ZodError } from "zod";
import type { ActionState } from "./form-state";

export function actionStateFromError(error: unknown): ActionState {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of error.issues) {
      const key = issue.path.map(String).join(".") || "form";
      (fieldErrors[key] ??= []).push(issue.message);
    }

    return { fieldErrors };
  }

  return { error: "No se pudo completar la acción" };
}
