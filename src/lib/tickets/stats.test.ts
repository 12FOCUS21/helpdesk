import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { getTicketStats } from "./stats";

beforeEach(async () => {
  await prisma.session.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function createAuthor() {
  return prisma.user.create({
    data: {
      name: "Agente",
      email: "agente@stats.dev",
      passwordHash: "hash",
    },
  });
}

describe("getTicketStats", () => {
  it("devuelve cero en todos los grupos cuando no hay tickets", async () => {
    const stats = await getTicketStats();

    expect(stats).toEqual({
      total: 0,
      byStatus: { abierto: 0, en_progreso: 0, cerrado: 0 },
      byPriority: { baja: 0, media: 0, alta: 0 },
    });
  });

  it("cuenta los tickets por estado y prioridad", async () => {
    const author = await createAuthor();

    await prisma.ticket.createMany({
      data: [
        {
          title: "Ticket abierto",
          description: "Descripción del ticket abierto.",
          authorId: author.id,
          status: "abierto",
          priority: "alta",
        },
        {
          title: "Ticket en progreso",
          description: "Descripción del ticket en progreso.",
          authorId: author.id,
          status: "en_progreso",
          priority: "media",
        },
        {
          title: "Ticket cerrado",
          description: "Descripción del ticket cerrado.",
          authorId: author.id,
          status: "cerrado",
          priority: "baja",
        },
      ],
    });

    const stats = await getTicketStats();

    expect(stats.total).toBe(3);
    expect(stats.byStatus).toEqual({
      abierto: 1,
      en_progreso: 1,
      cerrado: 1,
    });
    expect(stats.byPriority).toEqual({ baja: 1, media: 1, alta: 1 });
  });
});
