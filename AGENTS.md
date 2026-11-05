# Reglas del proyecto HelpDesk

## Contexto

Aplicación web de tickets de soporte. El objetivo es aprender el ciclo completo de ingeniería de software asistido por IA: planificar, implementar, revisar, probar y documentar.

## Stack

- Next.js 16 con App Router y carpeta `src/`
- TypeScript en modo estricto
- Tailwind CSS 4
- Prisma + SQLite
- Vitest para pruebas

## Comandos

- `npm run dev`: servidor de desarrollo
- `npm run build`: compilación de producción
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript sin emitir archivos
- `npm run db:generate`: genera el cliente de Prisma
- `npm run db:migrate`: crea y aplica migraciones
- `npm run db:seed`: carga los datos de prueba
- `npm run db:studio`: abre Prisma Studio
- `npm run db:reset`: reinicia la base de datos y la vuelve a sembrar
- `npm test`: ejecuta las pruebas una vez
- `npm run test:watch`: ejecuta las pruebas en modo vigilancia

## Convenciones de código

- Usar Server Components por defecto; añadir `"use client"` solo cuando sea necesario.
- Componentes en PascalCase, archivos de componentes en PascalCase.
- Funciones y variables en camelCase.
- Rutas y carpetas en minúsculas y kebab-case.
- Validar toda entrada del usuario con Zod.
- La lógica de negocio vive en `src/lib/tickets`; las rutas y componentes solo la orquestan.
- No añadir comentarios salvo que aporten información que el código no exprese.
- Mantener las funciones pequeñas y con una sola responsabilidad.

## Base de datos

- Usar siempre la instancia compartida de `src/lib/prisma.ts`; no instanciar `PrismaClient` en componentes ni rutas.
- Todo cambio de modelo requiere editar `prisma/schema.prisma` y crear una migración con `npm run db:migrate`.
- No editar migraciones ya aplicadas; crear una nueva.
- El archivo `prisma/dev.db` y el cliente generado no se versionan.
- Los estados y prioridades usan los enums `TicketStatus` y `TicketPriority`.

## Pruebas

- Las pruebas viven junto al código con el sufijo `.test.ts`.
- `npm test` usa `prisma/test.db`; nunca ejecutar pruebas contra `prisma/dev.db`.
- Probar la lógica de negocio y la validación; no probar detalles de implementación de Prisma.
- Toda regla de negocio nueva debe incluir al menos una prueba.
- Las pruebas deben ejecutarse antes de cada commit.

## Flujo de trabajo con IA

1. Describir el objetivo, el contexto y los criterios de aceptación.
2. Pedir un plan antes de escribir código.
3. Implementar en pasos pequeños, una funcionalidad por vez.
4. Revisar el diff línea por línea y pedir explicación de lo que no se entienda.
5. Verificar con `npm run lint`, `npm run typecheck` y las pruebas.
6. Hacer un commit por tarea con un mensaje claro.
7. Anotar en `docs/retro.md` qué funcionó y qué se corrigió.

## Definición de terminado

Una tarea está terminada cuando:

- Cumple los criterios de aceptación.
- Pasa lint y typecheck.
- Tiene pruebas cuando incluye lógica de negocio.
- El diff fue revisado y entendido.
- La documentación relevante está actualizada.
- Está en un commit con mensaje descriptivo.

## Seguridad

- Nunca commitear secretos ni archivos `.env`.
- No inventar credenciales, URLs ni dependencias.
- No ejecutar comandos destructivos sin confirmación.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
