import bcrypt from "bcryptjs";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  authenticate,
  createSession,
  deleteSession,
  findSessionUser,
} from "./session";

const password = "password123";
let userId = "";

beforeEach(async () => {
  await prisma.session.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "Agente",
      email: "agente@auth.dev",
      passwordHash: await bcrypt.hash(password, 4),
    },
  });

  userId = user.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("authenticate", () => {
  it("devuelve el usuario con credenciales válidas", async () => {
    const user = await authenticate("agente@auth.dev", password);

    expect(user).toEqual({
      id: userId,
      name: "Agente",
      email: "agente@auth.dev",
    });
  });

  it("normaliza el correo antes de buscar", async () => {
    const user = await authenticate("  AGENTE@AUTH.DEV  ", password);

    expect(user?.id).toBe(userId);
  });

  it("rechaza una contraseña incorrecta", async () => {
    expect(await authenticate("agente@auth.dev", "incorrecta")).toBeNull();
  });

  it("rechaza un correo desconocido", async () => {
    expect(await authenticate("otro@auth.dev", password)).toBeNull();
  });
});

describe("sesiones", () => {
  it("crea una sesión y devuelve el usuario asociado", async () => {
    const { token } = await createSession(userId);
    const user = await findSessionUser(token);

    expect(user).toEqual({
      id: userId,
      name: "Agente",
      email: "agente@auth.dev",
    });
  });

  it("no guarda el token en claro", async () => {
    const { token } = await createSession(userId);
    const session = await prisma.session.findFirst();

    expect(session?.tokenHash).toBeDefined();
    expect(session?.tokenHash).not.toBe(token);
  });

  it("rechaza un token desconocido", async () => {
    expect(await findSessionUser("token-invalido")).toBeNull();
  });

  it("elimina la sesión cuando ha expirado", async () => {
    const { token } = await createSession(userId);
    await prisma.session.updateMany({
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    expect(await findSessionUser(token)).toBeNull();
    expect(await prisma.session.count()).toBe(0);
  });

  it("elimina la sesión al cerrar sesión", async () => {
    const { token } = await createSession(userId);
    await deleteSession(token);

    expect(await findSessionUser(token)).toBeNull();
  });
});
