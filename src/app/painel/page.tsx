import Link from "next/link";
import { ReservationStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppHeader } from "@/components/app-header";
import { RoomStatusBadge } from "@/components/room-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { expireStaleReservations } from "@/lib/expire-reservations";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PainelPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await expireStaleReservations();
  const { q } = await searchParams;
  const session = await getSession();

  const [rooms, upcomingReservations] = await Promise.all([
    prisma.room.findMany({
      include: { currentHolder: true },
      orderBy: { number: "asc" },
    }),
    prisma.reservation.findMany({
      where: {
        status: {
          in: [ReservationStatus.CONFIRMADA, ReservationStatus.ATIVA],
        },
      },
      include: { user: true },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
  ]);

  const reservationsByRoom = new Map(
    upcomingReservations.map((r) => [r.roomId, r]),
  );

  const query = q?.trim().toLowerCase() ?? "";
  const filtered = query
    ? rooms.filter(
        (r) =>
          r.number.toLowerCase().includes(query) ||
          r.name.toLowerCase().includes(query) ||
          r.currentHolder?.name.toLowerCase().includes(query),
      )
    : rooms;

  const livres = filtered.filter((r) => r.status === "LIVRE").length;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={session} title="Painel de salas" />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Status das chaves</h1>
            <p className="text-muted-foreground">
              {livres} de {filtered.length} salas livres
            </p>
          </div>
          {session && ["ALUNO", "PROFESSOR"].includes(session.role) && (
            <Link
              href="/reservar"
              className={cn(
                buttonVariants(),
                "bg-emerald-700 text-white hover:bg-emerald-800",
              )}
            >
              Nova reserva
            </Link>
          )}
        </div>

        <form className="sticky top-[4.5rem] z-30">
          <input
            name="q"
            defaultValue={q}
            placeholder="Filtrar por sala ou nome…"
            className="flex min-h-12 w-full rounded-lg border border-input bg-background px-3 text-base shadow-sm"
          />
        </form>

        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((room) => (
            <li
              key={room.id}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-bold">{room.number}</p>
                  <p className="text-sm text-muted-foreground">{room.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ROOM_TYPE_LABELS[room.type]} · {room.building}
                  </p>
                </div>
                <RoomStatusBadge
                  status={room.status}
                  holderName={room.currentHolder?.name}
                />
              </div>
              {(() => {
                const res = reservationsByRoom.get(room.id);
                if (!res) return null;
                const label =
                  res.status === "ATIVA"
                    ? "Em uso agora"
                    : "Próxima reserva";
                return (
                  <p className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
                    <span className="font-medium text-emerald-900">{label}:</span>{" "}
                    {res.user.name} ·{" "}
                    {format(res.date, "dd/MM", { locale: ptBR })} das{" "}
                    {res.startTime} às {res.endTime}
                  </p>
                );
              })()}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
