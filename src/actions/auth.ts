"use server";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSession, roleHomePath, setSession } from "@/lib/session";

export type AuthFormState = { error: string } | null;

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const role = formData.get("role") as UserRole;

  if (!identifier || !role) {
    return { error: "Preencha identificador e cargo." };
  }

  const user = await prisma.user.findFirst({
    where: { identifier, role },
  });

  if (!user) {
    return {
      error:
        "Usuário não encontrado. Use os dados de demonstração ou cadastre-se na recepção.",
    };
  }

  await setSession(user.id);
  redirect(roleHomePath(user.role));
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const identifier = String(formData.get("identifier") ?? "").trim();
  const role = formData.get("role") as UserRole;

  if (!name || !identifier || !role) {
    return { error: "Preencha todos os campos." };
  }

  if (role === "PORTEIRO") {
    return { error: "Cadastro de porteiro é feito apenas pela coordenação." };
  }

  const existing = await prisma.user.findUnique({ where: { identifier } });
  if (existing) {
    return { error: "Identificador já cadastrado." };
  }

  const user = await prisma.user.create({
    data: { name, identifier, role },
  });

  await setSession(user.id);
  redirect(roleHomePath(user.role));
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
