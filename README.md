# HelpDesk

Sistema de tickets de soporte desarrollado como proyecto de aprendizaje de ingeniería de software y del flujo de trabajo con IA.

## Estado

MVP completo (semana 8). Versión `v1.0.0`: autenticación, CRUD de tickets, comentarios, panel de métricas, filtros, manejo de errores y pruebas automatizadas.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- TypeScript
- Tailwind CSS 4
- [Prisma](https://www.prisma.io) 7 + SQLite
- [Zod](https://zod.dev) para validación
- [Vitest](https://vitest.dev) para pruebas

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
| `npm test` | Ejecuta las pruebas una vez |
| `npm run test:watch` | Ejecuta las pruebas en modo vigilancia |
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

## Autenticación

El acceso requiere iniciar sesión en `/login` o crear una cuenta en `/register`. Las sesiones se guardan en la tabla `sessions` como un hash SHA-256 del token; la cookie `helpdesk_session` es `httpOnly`, `SameSite=Lax`, dura 7 días y las rutas bajo `(app)` están protegidas con `requireUser()`. Al registrarse, la sesión se inicia automáticamente.

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/login` | Inicio de sesión |
| `/register` | Crear una cuenta |
| `/dashboard` | Panel con métricas |
| `/tickets` | Lista de tickets con filtros |
| `/tickets/new` | Crear un ticket |
| `/tickets/[id]` | Detalle y comentarios |
| `/tickets/[id]/edit` | Editar un ticket |

## Estructura

```text
helpdesk/
├── docs/
│   └── vision.md            # Alcance y criterios de aceptación del MVP
├── prisma/
│   ├── migrations/          # Historial de migraciones
│   ├── schema.prisma        # Modelo de datos
│   ├── seed.ts              # Datos de prueba
│   └── dev.db               # Base de datos local (no se versiona)
├── public/                  # Recursos estáticos
├── src/
│   ├── app/
│   │   ├── (app)/           # Rutas protegidas
│   │   ├── (auth)/          # Inicio de sesión y registro
│   │   ├── error.tsx        # Error boundary raíz
│   │   └── not-found.tsx    # Página 404 global
│   ├── components/          # Componentes de interfaz
│   ├── generated/           # Cliente de Prisma generado (no se versiona)
│   └── lib/
│       ├── action-state.ts  # Errores de Server Actions
│       ├── auth/            # Sesiones, cookies y guardas
│       ├── prisma.ts        # Instancia única de Prisma Client
│       ├── validation.ts    # Esquemas de Zod
│       ├── format.ts        # Formato de fechas
│       └── tickets/
│           ├── actions.ts   # Server Actions
│           ├── constants.ts # Estados y prioridades
│           ├── stats.ts     # Métricas del panel
│           ├── status.ts    # Máquina de estados
│           └── service.ts   # Lógica de negocio
├── AGENTS.md                # Reglas para trabajar con IA
└── README.md
```

## Manejo de errores

- `error.tsx` captura errores inesperados y ofrece reintentar o volver al panel.
- `not-found.tsx` muestra la página 404 global; el detalle de un ticket inexistente usa su propio `not-found.tsx` con estado HTTP 404.
- Las Server Actions devuelven errores de validación por campo mediante `actionStateFromError` y muestran mensajes al usuario.

## Base de datos

La base de datos es un archivo SQLite en `prisma/dev.db` que no se versiona. Las migraciones sí se versionan en `prisma/migrations`. Para cambiar el modelo, edita `prisma/schema.prisma` y ejecuta `npm run db:migrate`.

## Pruebas

`npm test` usa una base de datos independiente en `prisma/test.db`, aplica las migraciones y limpia los datos antes de cada prueba. Los archivos de prueba se ejecutan en serie porque comparten esa base SQLite. Incluye pruebas unitarias de validación y de la máquina de estados, pruebas de integración de la lógica de negocio, pruebas de autenticación, registro y sesiones, pruebas de las métricas y pruebas de la conversión de errores de Server Actions.

## Despliegue

La aplicación está pensada para ejecutarse en local o en un servidor con sistema de archivos persistente.

Demo local de producción:

```powershell
npm run build
npm run start
```

Notas para un despliegue público:

- SQLite (`prisma/dev.db`) no es adecuado para plataformas con sistema de archivos efímero como Vercel: los datos y las sesiones se perderían entre despliegues.
- Para producción, usa PostgreSQL y cambia el `provider` del datasource, el adapter de Prisma y `DATABASE_URL`.
- Ejecuta las migraciones con `npx prisma migrate deploy` y define las variables de entorno del servidor.
- Todavía no hay un despliegue público configurado; esta sección describe los pasos pendientes.

## Documentación

- [Visión y alcance del MVP](docs/vision.md)
- [Retrospectiva](docs/retro.md)

## Flujo de trabajo

El proyecto se desarrolla en ciclos pequeños: contexto → plan → implementación → revisión del diff → verificación → commit → retrospectiva. Las reglas detalladas están en [AGENTS.md](AGENTS.md).
