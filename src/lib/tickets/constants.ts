export const TICKET_STATUSES = ["abierto", "en_progreso", "cerrado"] as const;
export const TICKET_PRIORITIES = ["baja", "media", "alta"] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
