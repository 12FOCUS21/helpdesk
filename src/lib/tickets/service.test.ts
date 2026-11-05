import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  addComment,
  changeTicketStatus,
  createTicket,
  deleteTicket,
  getTicket,
  listTickets,
  TicketNotFoundError,
  updateTicket,
} from "./service";
import { InvalidTransitionError } from "./status";

let agentId = "";
let requesterId = "";

beforeEach(async () => {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const [agent, requester] = await Promise.all([
    prisma.user.create({
      data: { name: "Agente", email: "agente@test.dev", passwordHash: "hash" },
    }),
    prisma.user.create({
      data: {
        name: "Solicitante",
        email: "solicitante@test.dev",
        passwordHash: "hash",
      },
    }),
  ]);

  agentId = agent.id;
  requesterId = requester.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

function ticketInput(overrides: Record<string, unknown> = {}) {
  return {
    title: "Error al guardar",
    description: "Al pulsar el botón guardar no ocurre nada.",
    authorId: requesterId,
    ...overrides,
  };
}

describe("createTicket", () => {
  it("crea un ticket con estado abierto y prioridad media", async () => {
    const ticket = await createTicket(ticketInput());

    expect(ticket.status).toBe("abierto");
    expect(ticket.priority).toBe("media");
    expect(ticket.assigneeId).toBeNull();
  });

  it("recorta los espacios y respeta la prioridad indicada", async () => {
    const ticket = await createTicket(
      ticketInput({ title: "  Error al guardar  ", priority: "alta" }),
    );

    expect(ticket.title).toBe("Error al guardar");
    expect(ticket.priority).toBe("alta");
  });

  it("rechaza datos inválidos", async () => {
    await expect(createTicket(ticketInput({ title: "ab" }))).rejects.toThrow();
  });
});

describe("updateTicket", () => {
  it("actualiza solo los campos enviados", async () => {
    const ticket = await createTicket(ticketInput());

    const updated = await updateTicket(ticket.id, { priority: "alta" });

    expect(updated.priority).toBe("alta");
    expect(updated.title).toBe(ticket.title);
  });

  it("rechaza una actualización vacía", async () => {
    const ticket = await createTicket(ticketInput());

    await expect(updateTicket(ticket.id, {})).rejects.toThrow();
  });
});

describe("listTickets", () => {
  it("filtra por estado", async () => {
    const first = await createTicket(ticketInput({ title: "Error de login" }));
    await createTicket(ticketInput({ title: "Exportar reporte" }));
    await changeTicketStatus(first.id, { status: "en_progreso" });

    const result = await listTickets({ status: "en_progreso" });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(first.id);
  });

  it("busca por título sin distinguir mayúsculas", async () => {
    await createTicket(ticketInput({ title: "Error de login" }));
    await createTicket(ticketInput({ title: "Exportar reporte" }));

    const result = await listTickets({ search: "LOGIN" });

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Error de login");
  });

  it("busca también en la descripción", async () => {
    await createTicket(
      ticketInput({
        title: "Problema de acceso",
        description: "La pantalla se queda cargando.",
      }),
    );
    await createTicket(
      ticketInput({
        title: "Otro ticket",
        description: "No carga el panel principal.",
      }),
    );

    const result = await listTickets({ search: "pantalla" });

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Problema de acceso");
  });

  it("devuelve todos los tickets sin filtros", async () => {
    await createTicket(ticketInput({ title: "Ticket uno" }));
    await createTicket(ticketInput({ title: "Ticket dos" }));

    expect(await listTickets()).toHaveLength(2);
  });
});

describe("changeTicketStatus", () => {
  it("recorre el ciclo abierto, en progreso, cerrado y reabierto", async () => {
    const ticket = await createTicket(ticketInput());

    const inProgress = await changeTicketStatus(ticket.id, {
      status: "en_progreso",
    });
    expect(inProgress.status).toBe("en_progreso");

    const closed = await changeTicketStatus(ticket.id, { status: "cerrado" });
    expect(closed.status).toBe("cerrado");

    const reopened = await changeTicketStatus(ticket.id, { status: "abierto" });
    expect(reopened.status).toBe("abierto");
  });

  it("rechaza una transición no permitida", async () => {
    const ticket = await createTicket(ticketInput());

    await expect(
      changeTicketStatus(ticket.id, { status: "cerrado" }),
    ).rejects.toThrow(InvalidTransitionError);
  });

  it("lanza TicketNotFoundError si el ticket no existe", async () => {
    await expect(
      changeTicketStatus("inexistente", { status: "en_progreso" }),
    ).rejects.toThrow(TicketNotFoundError);
  });
});

describe("addComment", () => {
  it("añade un comentario recortando el cuerpo", async () => {
    const ticket = await createTicket(ticketInput());

    const comment = await addComment({
      ticketId: ticket.id,
      authorId: agentId,
      body: "  Estamos revisando el problema  ",
    });

    expect(comment.body).toBe("Estamos revisando el problema");
    expect(comment.ticketId).toBe(ticket.id);
  });

  it("rechaza un comentario vacío", async () => {
    const ticket = await createTicket(ticketInput());

    await expect(
      addComment({ ticketId: ticket.id, authorId: agentId, body: "   " }),
    ).rejects.toThrow();
  });

  it("lanza TicketNotFoundError si el ticket no existe", async () => {
    await expect(
      addComment({ ticketId: "inexistente", authorId: agentId, body: "Hola" }),
    ).rejects.toThrow(TicketNotFoundError);
  });
});

describe("getTicket", () => {
  it("incluye autor, asignado y comentarios", async () => {
    const ticket = await createTicket(ticketInput({ assigneeId: agentId }));
    await addComment({
      ticketId: ticket.id,
      authorId: agentId,
      body: "En revisión",
    });

    const result = await getTicket(ticket.id);

    expect(result.author.name).toBe("Solicitante");
    expect(result.assignee?.name).toBe("Agente");
    expect(result.comments).toHaveLength(1);
  });

  it("lanza TicketNotFoundError si el ticket no existe", async () => {
    await expect(getTicket("inexistente")).rejects.toThrow(TicketNotFoundError);
  });
});

describe("deleteTicket", () => {
  it("elimina el ticket y sus comentarios", async () => {
    const ticket = await createTicket(ticketInput());
    await addComment({
      ticketId: ticket.id,
      authorId: agentId,
      body: "Comentario",
    });

    await deleteTicket(ticket.id);

    expect(
      await prisma.ticket.findUnique({ where: { id: ticket.id } }),
    ).toBeNull();
    expect(
      await prisma.comment.count({ where: { ticketId: ticket.id } }),
    ).toBe(0);
  });
});
