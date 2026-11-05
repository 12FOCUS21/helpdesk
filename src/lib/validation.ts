import { z } from "zod";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "./tickets/constants";

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede superar los 100 caracteres"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(2000, "La descripción no puede superar los 2000 caracteres"),
  priority: z.enum(TICKET_PRIORITIES).default("media"),
  authorId: z.string().trim().min(1, "El autor es obligatorio"),
  assigneeId: z.string().trim().min(1).nullable().optional(),
});

export const updateTicketSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(100, "El título no puede superar los 100 caracteres")
      .optional(),
    description: z
      .string()
      .trim()
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(2000, "La descripción no puede superar los 2000 caracteres")
      .optional(),
    priority: z.enum(TICKET_PRIORITIES).optional(),
    assigneeId: z.string().trim().min(1).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes indicar al menos un campo para actualizar",
  });

export const createCommentSchema = z.object({
  ticketId: z.string().trim().min(1, "El ticket es obligatorio"),
  authorId: z.string().trim().min(1, "El autor es obligatorio"),
  body: z
    .string()
    .trim()
    .min(1, "El comentario no puede estar vacío")
    .max(1000, "El comentario no puede superar los 1000 caracteres"),
});

export const changeTicketStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES),
});

export const ticketFilterSchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  search: z
    .string()
    .trim()
    .max(100, "La búsqueda no puede superar los 100 caracteres")
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Introduce un correo electrónico válido")),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres"),
});

export type CreateTicketInput = z.input<typeof createTicketSchema>;
export type UpdateTicketInput = z.input<typeof updateTicketSchema>;
export type CreateCommentInput = z.input<typeof createCommentSchema>;
export type ChangeTicketStatusInput = z.input<typeof changeTicketStatusSchema>;
export type TicketFilterInput = z.input<typeof ticketFilterSchema>;
export type LoginInput = z.input<typeof loginSchema>;
