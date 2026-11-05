import { describe, expect, it } from "vitest";
import { actionStateFromError } from "./action-state";
import { createTicketSchema } from "./validation";

describe("actionStateFromError", () => {
  it("convierte un ZodError en errores por campo", () => {
    const result = createTicketSchema.safeParse({
      title: "ab",
      description: "corta",
      authorId: "",
    });

    if (result.success) {
      throw new Error("Se esperaba un error de validación");
    }

    const state = actionStateFromError(result.error);

    expect(state.fieldErrors?.title?.[0]).toBe(
      "El título debe tener al menos 3 caracteres",
    );
    expect(state.fieldErrors?.description?.[0]).toBe(
      "La descripción debe tener al menos 10 caracteres",
    );
    expect(state.fieldErrors?.authorId?.[0]).toBe("El autor es obligatorio");
  });

  it("devuelve un mensaje genérico para errores desconocidos", () => {
    expect(actionStateFromError(new Error("fallo inesperado"))).toEqual({
      error: "No se pudo completar la acción",
    });
  });
});
