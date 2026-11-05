# HelpDesk

Sistema de tickets de soporte desarrollado como proyecto de aprendizaje de ingeniería de software y del flujo de trabajo con IA.

## Estado

Semana 2 completada: modelo de datos, migración y datos de prueba.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- TypeScript
- Tailwind CSS 4
- [Prisma](https://www.prisma.io) 7 + SQLite
- Vitest (a partir de la semana 3)

## Requisitos

- Node.js 20 o superior
- npm
- Git

## Puesta en marcha

```powershell
npm install
Copy-Item .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

En bash o macOS/Linux, usa `cp .env.example .env`.

Abrir [http://localhost:3000](http://localhost:3000).

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Análisis estático con ESLint |
| `npm run typecheck` | Verificación de tipos con TypeScript |
| `npm run db:generate` | Genera el cliente de Prisma |
| `npm run db:migrate` | Crea y aplica migraciones |
| `npm run db:seed` | Carga los datos de prueba |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:reset` | Reinicia la base de datos y vuelve a sembrarla |

## Datos de prueba

Todas las cuentas usan la contraseña `password123`.

| Usuario | Correo |
| --- | --- |
| Agente Demo | `agente@helpdesk.dev` |
| Ana Torres | `ana@helpdesk.dev` |
| Luis Pérez | `luis@helpdesk.dev` |

## Estructura

```text
helpdesk/
├── docs/
│   └── vision.md        # Alcance y criterios de aceptación del MVP
├── prisma/
│   ├── migrations/      # Historial de migraciones
│   ├── schema.prisma    # Modelo de datos
│   ├── seed.ts          # Datos de prueba
│   └── dev.db           # Base de datos local (no se versiona)
├── public/              # Recursos estáticos
├── src/
│   ├── app/             # Rutas y layouts (App Router)
│   ├── generated/       # Cliente de Prisma generado (no se versiona)
│   └── lib/
│       └── prisma.ts    # Instancia única de Prisma Client
├── AGENTS.md            # Reglas para trabajar con IA
└── README.md
```

## Base de datos

La base de datos es un archivo SQLite en `prisma/dev.db` que no se versiona. Las migraciones sí se versionan en `prisma/migrations`. Para cambiar el modelo, edita `prisma/schema.prisma` y ejecuta `npm run db:migrate`.

## Documentación

- [Visión y alcance del MVP](docs/vision.md)

## Flujo de trabajo

El proyecto se desarrolla en ciclos pequeños: contexto → plan → implementación → revisión del diff → verificación → commit → retrospectiva. Las reglas detalladas están en [AGENTS.md](AGENTS.md).
