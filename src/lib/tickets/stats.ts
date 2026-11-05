import { prisma } from "@/lib/prisma";
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketPriority,
  type TicketStatus,
} from "./constants";

export type TicketStats = {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
};

export async function getTicketStats(): Promise<TicketStats> {
  const [statusGroups, priorityGroups] = await Promise.all([
    prisma.ticket.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.ticket.groupBy({ by: ["priority"], _count: { _all: true } }),
  ]);

  const byStatus = Object.fromEntries(
    TICKET_STATUSES.map((status) => [status, 0]),
  ) as Record<TicketStatus, number>;

  const byPriority = Object.fromEntries(
    TICKET_PRIORITIES.map((priority) => [priority, 0]),
  ) as Record<TicketPriority, number>;

  for (const group of statusGroups) {
    byStatus[group.status] = group._count._all;
  }

  for (const group of priorityGroups) {
    byPriority[group.priority] = group._count._all;
  }

  return {
    total: statusGroups.reduce((sum, group) => sum + group._count._all, 0),
    byStatus,
    byPriority,
  };
}
