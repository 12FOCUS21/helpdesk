import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const agent = await prisma.user.create({
    data: {
      name: "Agente Demo",
      email: "agente@helpdesk.dev",
      passwordHash,
    },
  });

  const ana = await prisma.user.create({
    data: {
      name: "Ana Torres",
      email: "ana@helpdesk.dev",
      passwordHash,
    },
  });

  const luis = await prisma.user.create({
    data: {
      name: "Luis Pérez",
      email: "luis@helpdesk.dev",
      passwordHash,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "No puedo iniciar sesión",
      description:
        "Al introducir mi correo y contraseña la página se queda cargando y no entra.",
      status: "abierto",
      priority: "alta",
      authorId: ana.id,
      assigneeId: agent.id,
      comments: {
        create: [
          {
            body: "Gracias por reportarlo. ¿Puedes confirmar el navegador que usas?",
            authorId: agent.id,
          },
        ],
      },
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Error al exportar el reporte mensual",
      description:
        "El botón de exportar descarga un archivo vacío cuando el rango incluye más de 30 días.",
      status: "en_progreso",
      priority: "media",
      authorId: luis.id,
      assigneeId: agent.id,
      comments: {
        create: [
          {
            body: "Reproducido. Estoy revisando el límite de filas.",
            authorId: agent.id,
          },
          {
            body: "Quedo atento, gracias.",
            authorId: luis.id,
          },
        ],
      },
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Solicitud de nueva categoría",
      description:
        "Necesitamos una categoría para clasificar las incidencias de facturación.",
      status: "cerrado",
      priority: "baja",
      authorId: ana.id,
      assigneeId: agent.id,
      comments: {
        create: [
          {
            body: "Categoría creada y publicada. Cierro el ticket.",
            authorId: agent.id,
          },
        ],
      },
    },
  });

  const counts = await prisma.ticket.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  console.log("Seed completado");
  console.log(`Usuarios: 3`);
  console.log(
    "Tickets por estado:",
    counts.map((group) => `${group.status}=${group._count._all}`).join(", "),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
