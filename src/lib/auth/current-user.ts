import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionToken } from "./cookies";
import { findSessionUser } from "./session";

export const getCurrentUser = cache(async () => {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return findSessionUser(token);
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
