import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ReservationForm } from "@/components/reservation-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { expireStaleReservations } from "@/lib/expire-reservations";
import { LATE_TOLERANCE_MINUTES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ReservarPage() {
  await expireStaleReservations();
  const session = await getSession();

  if (!session) redirect("/login");
  if (!["ALUNO", "PROFESSOR"].includes(session.role)) {
    redirect("/painel");
  }

  const rooms = await prisma.room.findMany({
    orderBy: { number: "asc" },
    select: { id: true, number: true, name: true, type: true, status: true },
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={session} title="Reservar chave" />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nova reserva</CardTitle>
            <CardDescription>
              O sistema verifica conflitos de horário. Após confirmar, retire a
              chave na guarita em até {LATE_TOLERANCE_MINUTES} minutos do
              horário inicial.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReservationForm rooms={rooms} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
