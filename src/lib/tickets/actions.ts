"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionStateFromError } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/current-user";
import type { ActionState } from "@/lib/form-state";
import {
  addComment,
  changeTicketStatus,
  createTicket,
  deleteTicket,
  updateTicket,
} from "@/lib/tickets/service";

function readField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export async function createTicketAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  let ticketId: string;

  try {
    const ticket = await createTicket({
      title: readField(formData, "title"),
      description: readField(formData, "description"),
      priority: readField(formData, "priority") || "media",
      authorId: user.id,
    });

    ticketId = ticket.id;
  } catch (error) {
    return actionStateFromError(error);
  }

  revalidatePath("/tickets");
  redirect(`/tickets/${ticketId}`);
}

export async function updateTicketAction(
  ticketId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  try {
    await updateTicket(ticketId, {
      title: readField(formData, "title"),
      description: readField(formData, "description"),
      priority: readField(formData, "priority"),
    });
  } catch (error) {
    return actionStateFromError(error);
  }

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);
  redirect(`/tickets/${ticketId}`);
}

export async function changeStatusAction(formData: FormData) {
  await requireUser();
  const ticketId = readField(formData, "ticketId");

  try {
    await changeTicketStatus(ticketId, {
      status: readField(formData, "status"),
    });
  } catch {
    redirect(`/tickets/${ticketId}?error=estado`);
  }

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);
  redirect(`/tickets/${ticketId}`);
}

export async function addCommentAction(formData: FormData) {
  const user = await requireUser();
  const ticketId = readField(formData, "ticketId");

  try {
    await addComment({
      ticketId,
      authorId: user.id,
      body: readField(formData, "body"),
    });
  } catch {
    redirect(`/tickets/${ticketId}?error=comentario`);
  }

  revalidatePath(`/tickets/${ticketId}`);
  redirect(`/tickets/${ticketId}`);
}

export async function deleteTicketAction(formData: FormData) {
  await requireUser();
  const ticketId = readField(formData, "ticketId");

  try {
    await deleteTicket(ticketId);
  } catch {
    redirect(`/tickets/${ticketId}?error=eliminar`);
  }

  revalidatePath("/tickets");
  redirect("/tickets");
}
