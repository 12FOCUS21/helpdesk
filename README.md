# HelpDesk

Sistema de tickets de soporte desarrollado como proyecto de aprendizaje de ingeniería de software y del flujo de trabajo con IA.

## Estado

Semana 1 completada: estructura del proyecto, scaffold de Next.js y definición del MVP.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma + SQLite (a partir de la semana 2)
- Vitest (a partir de la semana 3)

## Requisitos

- Node.js 20 o superior
- npm
- Git

## Puesta en marcha

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Análisis estático con ESLint |
| `npm run typecheck` | Verificación de tipos con TypeScript |

## Estructura

```text
helpdesk/
├── docs/
│   └── vision.md        # Alcance y criterios de aceptación del MVP
├── public/              # Recursos estáticos
├── src/
│   └── app/             # Rutas y layouts (App Router)
├── AGENTS.md            # Reglas para trabajar con IA
└── README.md
```

## Documentación

- [Visión y alcance del MVP](docs/vision.md)

## Flujo de trabajo

El proyecto se desarrolla en ciclos pequeños: contexto → plan → implementación → revisión del diff → verificación → commit → retrospectiva. Las reglas detalladas están en [AGENTS.md](AGENTS.md).
