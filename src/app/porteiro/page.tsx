import { redirect } from "next/navigation";
import { ReservationStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppHeader } from "@/components/app-header";
import { PorteiroPanel } from "@/components/porteiro-panel";
import type { ListItem } from "@/components/searchable-list";
import { expireStaleReservations } from "@/lib/expire-reservations";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PorteiroPage() {
  await expireStaleReservations();
  const session = await getSession();
  if (!session || session.role !== "PORTEIRO") redirect("/login");

  const [toDeliverRows, occupiedRooms] = await Promise.all([
    prisma.reservation.findMany({
      where: { status: ReservationStatus.CONFIRMADA },
      include: { user: true, room: true },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    prisma.room.findMany({
      where: { status: "OCUPADA" },
      include: { currentHolder: true },
      orderBy: { number: "asc" },
    }),
  ]);

  const toDeliver: ListItem[] = toDeliverRows.map((r) => ({
    id: r.id,
    primary: `${r.room.number} — ${r.user.name}`,
    secondary: r.user.identifier,
    meta: `${format(r.date, "dd/MM", { locale: ptBR })} · ${r.startTime}–${r.endTime}`,
  }));

  const toReceive: ListItem[] = occupiedRooms.map((r) => ({
    id: r.id,
    primary: `${r.number} — ${r.currentHolder?.name ?? "Sem nome"}`,
    secondary: r.currentHolder?.identifier ?? "",
    meta: r.name,
  }));

  return (
    <div className="flex min-h-dvh flex-col bg-emerald-50/40">
      <AppHeader user={session} title="Guarita" />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Controle de chaves</h1>
        <p className="mb-6 text-muted-foreground">
          Toque no nome da pessoa, depois no botão grande para confirmar.
        </p>
        <PorteiroPanel toDeliver={toDeliver} toReceive={toReceive} />
      </main>
    </div>
  );
}
