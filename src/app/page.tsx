import Link from "next/link";
import { ArrowRight, BarChart3, KeyRound, LayoutGrid } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-emerald-50/80 to-background">
      <AppHeader user={session} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8">
        <section className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
            Controle de chaves, simples e na palma da mão
          </h1>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            href="/painel"
            icon={<LayoutGrid className="size-6" />}
            title="Painel público"
            description="Veja quais salas estão livres ou ocupadas e quem está com a chave."
          />
          <FeatureCard
            href="/reservar"
            icon={<KeyRound className="size-6" />}
            title="Reservar chave"
            description="Agende data e horário antes de ir à guarita."
          />
          <FeatureCard
            href="/login"
            icon={<KeyRound className="size-6" />}
            title="Área do porteiro"
            description="Entregar e receber chaves com busca rápida."
          />
          <FeatureCard
            href="/login"
            icon={<BarChart3 className="size-6" />}
            title="Dashboard coordenação"
            description="Demanda por sala, horários e histórico."
          />
        </div>

        {!session ? (
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mx-auto flex min-h-14 w-full max-w-sm items-center justify-center text-lg bg-emerald-700 text-white hover:bg-emerald-800",
            )}
          >
            Entrar no sistema
            <ArrowRight className="ml-2 size-5" />
          </Link>
        ) : (
          <p className="text-center text-muted-foreground">
            Olá, <strong>{session.name}</strong>. Use o menu acima para navegar.
          </p>
        )}

        <Card className="border-dashed bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Demonstração (MVP)</CardTitle>
            <CardDescription>
              Porteiro: CPF 12345678901 · Professor: SIAPE 1234567 · Aluno:
              matrícula 2024001234 · Coordenador: SIAPE 7654321
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Prazo de tolerância para retirada após o horário da reserva: 15
            minutos (configurável).
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader>
          <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            {icon}
          </span>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
