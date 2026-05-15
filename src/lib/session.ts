import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { prisma } from "./prisma";

const SESSION_COOKIE = "chavefacil_session";

export type SessionUser = {
  id: string;
  name: string;
  role: UserRole;
  identifier: string;
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, role: true, identifier: true },
  });

  return user;
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function roleHomePath(role: UserRole): string {
  switch (role) {
    case "PORTEIRO":
      return "/porteiro";
    case "COORDENADOR":
      return "/coordenador";
    default:
      return "/painel";
  }
}
