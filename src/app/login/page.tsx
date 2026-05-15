import { AppHeader } from "@/components/app-header";
import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader title="Identificação" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Entrar ou cadastrar</CardTitle>
            <CardDescription>
              Escolha seu cargo e informe matrícula, SIAPE ou CPF conforme o
              perfil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
