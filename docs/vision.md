# Visión del MVP — HelpDesk

## Problema

Un equipo pequeño necesita registrar, dar seguimiento y cerrar solicitudes de soporte sin depender de hojas de cálculo ni mensajes dispersos.

## Objetivo

Construir una aplicación web que permita a usuarios autenticados crear tickets, comentarlos y cambiar su estado, con un panel básico de métricas.

## Usuarios

- **Solicitante**: crea tickets y consulta su estado.
- **Agente**: atiende tickets, comenta y cambia el estado.
- **Administrador** (v2): gestiona usuarios y prioridades.

## Alcance del MVP

### Incluido

- Registro e inicio de sesión con sesión por cookie.
- Crear, listar, ver, editar y cerrar tickets.
- Comentarios en cada ticket.
- Estados: `abierto`, `en_progreso`, `cerrado`.
- Prioridades: `baja`, `media`, `alta`.
- Filtros por estado y búsqueda por título o descripción.
- Panel con cantidad de tickets por estado y prioridad.
- Pruebas de las reglas de negocio principales.

### Excluido (v2)

- Roles y permisos avanzados.
- Adjuntos y notificaciones por correo.
- Etiquetas, SLA y reportes exportables.
- Aplicación móvil.

## Historias de usuario y criterios de aceptación

### HU-0: Registrarse

**Como** solicitante **quiero** crear una cuenta **para** registrar mis incidencias.

- El nombre debe tener entre 2 y 80 caracteres.
- El correo debe ser válido y no estar registrado.
- La contraseña debe tener al menos 8 caracteres y coincidir con su confirmación.
- Al registrarse, la sesión se inicia automáticamente.

### HU-1: Crear ticket

**Como** solicitante **quiero** crear un ticket **para** reportar un problema.

- El formulario exige título (3-100 caracteres) y descripción (10-2000 caracteres).
- Al guardar, el ticket queda en estado `abierto` con prioridad `media` por defecto, modificable en el formulario.
- Si la validación falla, se muestra el error y no se guarda nada.

### HU-2: Listar tickets

**Como** agente **quiero** ver todos los tickets **para** priorizar mi trabajo.

- La lista muestra título, estado, prioridad y fecha de creación.
- Se puede filtrar por estado.
- La búsqueda por título no distingue mayúsculas.
- Sin resultados, se muestra un estado vacío claro.

### HU-3: Comentar un ticket

**Como** agente **quiero** añadir comentarios **para** documentar la solución.

- Un comentario requiere entre 1 y 1000 caracteres.
- El comentario muestra autor y fecha.
- No se permiten comentarios vacíos.

### HU-4: Cambiar estado

**Como** agente **quiero** actualizar el estado **para** reflejar el avance.

- Transiciones permitidas: `abierto` → `en_progreso` → `cerrado`.
- Se puede reabrir un ticket cerrado.
- El cambio queda registrado con fecha de actualización.

### HU-5: Panel de métricas

**Como** administrador **quiero** ver un resumen **para** conocer la carga de trabajo.

- Muestra el total de tickets y el conteo por estado.
- Los datos se actualizan al recargar la página.

## Modelo conceptual

- **User**: id, name, email, passwordHash, createdAt.
- **Session**: id, tokenHash, userId, expiresAt, createdAt.
- **Ticket**: id, title, description, status, priority, authorId, assigneeId, createdAt, updatedAt.
- **Comment**: id, ticketId, authorId, body, createdAt.

Relaciones:

- Un usuario crea muchos tickets.
- Un ticket tiene muchos comentarios.
- Un ticket puede estar asignado a un agente.

## Métricas de éxito del aprendizaje

- Completar las 8 semanas del plan.
- Mantener lint y typecheck en verde.
- Tener al menos una prueba por regla de negocio.
- Poder explicar cada archivo del proyecto sin ayuda de la IA.

## Roadmap

| Semana | Entregable |
| --- | --- |
| 1 | Estructura, scaffold y visión |
| 2 | Modelo de datos y seed |
| 3 | Lógica, validación y pruebas |
| 4 | Lista y detalle de tickets |
| 5 | Crear/editar y sesión |
| 6 | Panel y filtros |
| 7 | Calidad y documentación |
| 8 | Despliegue y retrospectiva |
