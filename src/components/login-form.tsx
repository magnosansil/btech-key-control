"use client";

import { useActionState, useState } from "react";
import { UserRole } from "@prisma/client";
import { loginAction, registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDENTIFIER_HINTS, ROLE_LABELS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ROLES: UserRole[] = ["ALUNO", "PROFESSOR", "COORDENADOR", "PORTEIRO"];

export function LoginForm() {
  const [role, setRole] = useState<UserRole>("ALUNO");
  const [registerRole, setRegisterRole] = useState<UserRole>("ALUNO");

  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    null,
  );
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    null,
  );

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid h-12 w-full grid-cols-2">
        <TabsTrigger value="login" className="text-base">
          Entrar
        </TabsTrigger>
        <TabsTrigger value="register" className="text-base">
          Cadastrar
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-6 space-y-4">
        <RoleFields role={role} setRole={setRole} />
        <form action={loginFormAction} className="space-y-4">
          <input type="hidden" name="role" value={role} />
          <IdentifierField role={role} />
          {loginState?.error && (
            <p className="text-sm text-destructive" role="alert">
              {loginState.error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loginPending}
            className="min-h-12 w-full text-base bg-emerald-700 hover:bg-emerald-800"
          >
            {loginPending ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register" className="mt-6 space-y-4">
        <RoleFields
          role={registerRole}
          setRole={setRegisterRole}
          excludePorteiro
        />
        <form action={registerFormAction} className="space-y-4">
          <input type="hidden" name="role" value={registerRole} />
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" name="name" required className="min-h-12 text-base" />
          </div>
          <IdentifierField role={registerRole} />
          {registerState?.error && (
            <p className="text-sm text-destructive" role="alert">
              {registerState.error}
            </p>
          )}
          <Button
            type="submit"
            disabled={registerPending || registerRole === "PORTEIRO"}
            className="min-h-12 w-full text-base bg-emerald-700 hover:bg-emerald-800"
          >
            {registerPending ? "Cadastrando…" : "Criar conta"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

function RoleFields({
  role,
  setRole,
  excludePorteiro,
}: {
  role: UserRole;
  setRole: (r: UserRole) => void;
  excludePorteiro?: boolean;
}) {
  const options = excludePorteiro
    ? ROLES.filter((r) => r !== "PORTEIRO")
    : ROLES;

  return (
    <div className="space-y-2">
      <Label>Cargo</Label>
      <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
        <SelectTrigger className="min-h-12 text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((r) => (
            <SelectItem key={r} value={r} className="text-base py-3">
              {ROLE_LABELS[r]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function IdentifierField({ role }: { role: UserRole }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="identifier">{IDENTIFIER_HINTS[role]}</Label>
      <Input
        id="identifier"
        name="identifier"
        required
        inputMode="numeric"
        className="min-h-12 text-base"
        placeholder={IDENTIFIER_HINTS[role]}
      />
    </div>
  );
}
