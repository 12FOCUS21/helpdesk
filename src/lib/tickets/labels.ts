import type { TicketPriority, TicketStatus } from "./constants";

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  abierto: "Abierto",
  en_progreso: "En progreso",
  cerrado: "Cerrado",
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};
