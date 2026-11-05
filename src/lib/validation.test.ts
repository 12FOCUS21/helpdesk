import { describe, expect, it } from "vitest";
import {
  createCommentSchema,
  createTicketSchema,
  loginSchema,
  registerSchema,
  ticketFilterSchema,
  updateTicketSchema,
} from "./validation";

const validTicket = {
  title: "No puedo iniciar sesión",
  description: "La página se queda cargando después de introducir mis datos.",
  authorId: "user_1",
};

describe("createTicketSchema", () => {
  it("aplica los valores por defecto y recorta espacios", () => {
    const result = createTicketSchema.parse({
      ...validTicket,
      title: "  No puedo iniciar sesión  ",
      description: "  La página se queda cargando después de introducir mis datos.  ",
    });

    expect(result.title).toBe("No puedo iniciar sesión");
    expect(result.description).toBe(
      "La página se queda cargando después de introducir mis datos.",
    );
    expect(result.priority).toBe("media");
    expect(result.assigneeId).toBeUndefined();
  });

  it("rechaza un título demasiado corto", () => {
    const result = createTicketSchema.safeParse({ ...validTicket, title: "ab" });

    expect(result.success).toBe(false);
  });

  it("rechaza una descripción demasiado corta", () => {
    const result = createTicketSchema.safeParse({
      ...validTicket,
      description: "corta",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza una prioridad desconocida", () => {
    const result = createTicketSchema.safeParse({
      ...validTicket,
      priority: "urgente",
    });

    expect(result.success).toBe(false);
  });

  it("exige un autor", () => {
    const result = createTicketSchema.safeParse({ ...validTicket, authorId: "  " });

    expect(result.success).toBe(false);
  });
});

describe("updateTicketSchema", () => {
  it("rechaza una actualización sin campos", () => {
    const result = updateTicketSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("acepta la actualización de un solo campo", () => {
    const result = updateTicketSchema.safeParse({ title: "Nuevo título" });

    expect(result.success).toBe(true);
  });

  it("permite desasignar el ticket", () => {
    const result = updateTicketSchema.safeParse({ assigneeId: null });

    expect(result.success).toBe(true);
  });
});

describe("createCommentSchema", () => {
  it("recorta el cuerpo del comentario", () => {
    const result = createCommentSchema.parse({
      ticketId: "ticket_1",
      authorId: "user_1",
      body: "  Estamos revisando el problema  ",
    });

    expect(result.body).toBe("Estamos revisando el problema");
  });

  it("rechaza un comentario vacío", () => {
    const result = createCommentSchema.safeParse({
      ticketId: "ticket_1",
      authorId: "user_1",
      body: "   ",
    });

    expect(result.success).toBe(false);
  });
});

describe("ticketFilterSchema", () => {
  it("acepta un filtro vacío", () => {
    expect(ticketFilterSchema.parse({})).toEqual({});
  });

  it("acepta un estado válido y recorta la búsqueda", () => {
    const result = ticketFilterSchema.parse({
      status: "en_progreso",
      search: "  login  ",
    });

    expect(result).toEqual({ status: "en_progreso", search: "login" });
  });

  it("rechaza un estado desconocido", () => {
    const result = ticketFilterSchema.safeParse({ status: "pendiente" });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("normaliza el correo electrónico", () => {
    const result = loginSchema.parse({
      email: "  AGENTE@HELPDESK.DEV  ",
      password: "password123",
    });

    expect(result.email).toBe("agente@helpdesk.dev");
  });

  it("rechaza un correo inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-es-un-correo",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza una contraseña demasiado corta", () => {
    const result = loginSchema.safeParse({
      email: "agente@helpdesk.dev",
      password: "corta",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("normaliza el nombre y el correo", () => {
    const result = registerSchema.parse({
      name: "  Ana Torres  ",
      email: "  ANA@HELPDESK.DEV ",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.name).toBe("Ana Torres");
    expect(result.email).toBe("ana@helpdesk.dev");
  });

  it("rechaza contraseñas que no coinciden", () => {
    const result = registerSchema.safeParse({
      name: "Ana Torres",
      email: "ana@helpdesk.dev",
      password: "password123",
      confirmPassword: "password124",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza un nombre demasiado corto", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "ana@helpdesk.dev",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });
});
