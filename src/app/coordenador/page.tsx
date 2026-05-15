import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppHeader } from "@/components/app-header";
import { CoordenadorCharts } from "@/components/coordenador-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCoordenadorAnalytics } from "@/lib/analytics";
import { expireStaleReservations } from "@/lib/expire-reservations";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CoordenadorPage() {
  await expireStaleReservations();
  const session = await getSession();
  if (!session || session.role !== "COORDENADOR") redirect("/login");

  const { roomDemand, hourDemand, idleRooms, history } =
    await getCoordenadorAnalytics();

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={session} title="Coordenação" />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard analítico</h1>
          <p className="text-muted-foreground">
            Visão de demanda, ociosidade e histórico de reservas.
          </p>
        </div>

        <CoordenadorCharts
          roomDemand={roomDemand}
          hourDemand={hourDemand}
          idleRooms={idleRooms}
        />

        <Card>
          <CardHeader>
            <CardTitle>Histórico recente</CardTitle>
            <CardDescription>Últimas 20 movimentações registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {history.length === 0 ? (
                <li className="py-6 text-center text-muted-foreground">
                  Nenhuma reserva registrada ainda.
                </li>
              ) : (
                history.map((h) => (
                  <li
                    key={h.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {h.room.number} — {h.user.name}
                      </p>
                      <p className="text-muted-foreground">
                        {format(h.date, "dd/MM/yyyy", { locale: ptBR })} ·{" "}
                        {h.startTime}–{h.endTime}
                      </p>
                    </div>
                    <Badge variant="outline">{h.status}</Badge>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
