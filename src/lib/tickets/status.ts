import type { TicketStatus } from "./constants";

const ALLOWED_TRANSITIONS: Record<TicketStatus, readonly TicketStatus[]> = {
  abierto: ["en_progreso"],
  en_progreso: ["cerrado"],
  cerrado: ["abierto"],
};

export class InvalidTransitionError extends Error {
  constructor(from: TicketStatus, to: TicketStatus) {
    super(`Transición no permitida: ${from} → ${to}`);
    this.name = "InvalidTransitionError";
  }
}

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertTransition(from: TicketStatus, to: TicketStatus): void {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to);
  }
}
