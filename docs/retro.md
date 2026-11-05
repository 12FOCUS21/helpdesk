# Retrospectiva del MVP — HelpDesk

## Resumen

En ocho semanas se construyó un MVP de mesa de ayuda con Next.js 16, Prisma 7, SQLite y Vitest. El proyecto cubre el ciclo completo: modelo de datos, reglas de negocio, interfaz, autenticación, pruebas, manejo de errores y documentación.

## Qué se construyó

- Registro e inicio de sesión con sesiones en base de datos y cookie `httpOnly`.
- Creación, listado, detalle, edición y eliminación de tickets.
- Comentarios y cambios de estado con transiciones `abierto → en_progreso → cerrado → abierto`.
- Filtro por estado y búsqueda por título o descripción.
- Panel con métricas por estado y prioridad.
- Manejo de errores con `error.tsx`, página 404 global y 404 de ticket.
- 62 pruebas automatizadas y verificación end-to-end de los flujos principales.

## Qué funcionó

- **Trabajar por semanas con un entregable cerrado**: cada semana terminó con lint, typecheck, pruebas y un commit.
- **Separar lógica de negocio de la interfaz**: `src/lib/tickets` concentra validación, servicio y máquina de estados; las páginas solo orquestan.
- **Validar con Zod en la frontera**: los formularios y los servicios comparten los mismos esquemas, lo que evitó duplicar reglas.
- **Probar la lógica con una base SQLite real**: las pruebas de integración detectaron errores que las pruebas unitarias no habrían visto.
- **Definir reglas en `AGENTS.md`**: mantener comandos, convenciones y límites de seguridad explícitos facilitó el trabajo con IA.
- **Verificar los flujos completos**: una prueba HTTP con sesión real validó login, registro, CRUD, filtros, logout y 404.

## Dificultades y soluciones

| Dificultad | Solución |
| --- | --- |
| Prisma 7 no carga `.env` automáticamente y exige un adapter | `import "dotenv/config"` en la configuración y `PrismaBetterSqlite3` en `src/lib/prisma.ts` |
| El cliente generado no se actualizaba tras una migración | Ejecutar `prisma generate` explícitamente y comprobar los tipos antes de continuar |
| Next.js 16 cambió APIs: `retry` en `error.tsx`, `cookies()` y `params` asíncronos | Leer la documentación local de Next y ajustar los tipos |
| Los tipos de rutas generados quedaron obsoletos al mover `page.tsx` | Borrar `.next` y ejecutar `next typegen` |
| Las pruebas compartían `prisma/test.db` y se pisaban entre archivos | `fileParallelism: false` en Vitest |
| `notFound()` devolvía 200 por el streaming de `loading.tsx` | Mover el esqueleto de carga a un `<Suspense>` solo en la lista |
| `better-sqlite3` no se podía recompilar sin Python y herramientas nativas | Usar el binario precompilado y aprobar los scripts de instalación de npm |

## Decisiones relevantes

- **Sesiones opacas**: se guarda el hash SHA-256 del token, nunca el token en claro. La cookie dura siete días, es `httpOnly` y `SameSite=Lax`.
- **Sin roles en el MVP**: solicitantes y agentes comparten permisos; los roles quedan para la v2.
- **Server Actions con `revalidatePath`**: se evita mantener una API REST separada para el alcance actual.
- **Búsqueda ampliada**: además del título se busca en la descripción, una mejora pequeña sobre la visión original.
- **Prioridad seleccionable**: se conserva `media` por defecto, pero el formulario permite elegir `baja`, `media` o `alta`.

## Métricas

- 8 commits, uno por semana.
- 62 pruebas automatizadas en 6 archivos.
- `lint`, `typecheck` y `build` en verde al cierre.
- Flujo end-to-end validado: registro, login, panel, filtros, creación, edición, comentario, cambio de estado, eliminación, logout y 404.

## Qué haría distinto

- Añadir desde el inicio una prueba que ejecute varias páginas y acciones, para detectar antes los problemas de streaming y de estado de sesión.
- Configurar la base de datos de pruebas por archivo o usar transacciones aisladas en lugar de serializar toda la suite.
- Definir desde la semana 1 un `docs/retro.md` para anotar decisiones y dificultades mientras ocurrían.

## Próximos pasos (v2)

- Roles y permisos para solicitantes, agentes y administradores.
- Interfaz para asignar tickets y filtrar por prioridad o asignado.
- Paginación y ordenación de la lista.
- Notificaciones por correo y adjuntos.
- Recuperación de contraseña y limitación de intentos de login.
- Despliegue con PostgreSQL y almacenamiento persistente de sesiones.
- Registro de auditoría de cambios de estado.

## Cómo repasar el proyecto

1. Leer `docs/vision.md` para entender el alcance.
2. Recorrer `prisma/schema.prisma` y las migraciones.
3. Leer `src/lib/validation.ts`, `src/lib/tickets/status.ts` y `src/lib/tickets/service.ts`.
4. Revisar las Server Actions en `src/lib/*/actions.ts`.
5. Seguir el flujo de una página: `(app)/layout.tsx` → `tickets/page.tsx` → `tickets/[id]/page.tsx`.
6. Ejecutar `npm test`, `npm run lint`, `npm run typecheck` y `npm run build`.
7. Abrir la aplicación y completar el recorrido de un ticket de principio a fin.
