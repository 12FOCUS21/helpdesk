import { prisma } from "@/lib/prisma";
import {
  changeTicketStatusSchema,
  createCommentSchema,
  createTicketSchema,
  ticketFilterSchema,
  updateTicketSchema,
} from "@/lib/validation";
import { assertTransition } from "./status";

const userSelect = {
  id: true,
  name: true,
  email: true,
} as const;

const ticketInclude = {
  author: { select: userSelect },
  assignee: { select: userSelect },
  _count: { select: { comments: true } },
} as const;

export class TicketNotFoundError extends Error {
  constructor(id: string) {
    super(`No se encontró el ticket ${id}`);
    this.name = "TicketNotFoundError";
  }
}

export async function createTicket(input: unknown) {
  const data = createTicketSchema.parse(input);

  return prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      authorId: data.authorId,
      assigneeId: data.assigneeId ?? null,
    },
  });
}

export async function listTickets(input: unknown = {}) {
  const { status, search } = ticketFilterSchema.parse(input);

  return prisma.ticket.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search ? { title: { contains: search } } : {}),
    },
    include: ticketInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getTicket(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      ...ticketInclude,
      comments: {
        include: { author: { select: userSelect } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    throw new TicketNotFoundError(id);
  }

  return ticket;
}

export async function updateTicket(id: string, input: unknown) {
  const data = updateTicketSchema.parse(input);

  return prisma.ticket.update({
    where: { id },
    data,
  });
}

export async function changeTicketStatus(id: string, input: unknown) {
  const { status } = changeTicketStatusSchema.parse(input);

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!ticket) {
    throw new TicketNotFoundError(id);
  }

  assertTransition(ticket.status, status);

  return prisma.ticket.update({
    where: { id },
    data: { status },
  });
}

export async function addComment(input: unknown) {
  const data = createCommentSchema.parse(input);

  const ticket = await prisma.ticket.findUnique({
    where: { id: data.ticketId },
    select: { id: true },
  });

  if (!ticket) {
    throw new TicketNotFoundError(data.ticketId);
  }

  return prisma.comment.create({ data });
}

export async function deleteTicket(id: string) {
  return prisma.ticket.delete({ where: { id } });
}
