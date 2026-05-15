import { ReservationStatus } from "@prisma/client";
import { prisma } from "./prisma";

export async function getCoordenadorAnalytics() {
  const reservations = await prisma.reservation.findMany({
    where: {
      status: {
        in: [
          ReservationStatus.CONCLUIDA,
          ReservationStatus.ATIVA,
          ReservationStatus.CONFIRMADA,
        ],
      },
    },
    include: { room: true },
  });

  const roomCount = new Map<string, number>();
  const hourCount = new Map<string, number>();
  const allRooms = await prisma.room.findMany({ select: { number: true } });

  for (const r of reservations) {
    const label = `${r.room.number}`;
    roomCount.set(label, (roomCount.get(label) ?? 0) + 1);
    hourCount.set(r.startTime, (hourCount.get(r.startTime) ?? 0) + 1);
  }

  const roomDemand = [...roomCount.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const hourDemand = [...hourCount.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const idleRooms = allRooms
    .map((room) => ({
      name: room.number,
      total: roomCount.get(room.number) ?? 0,
    }))
    .sort((a, b) => a.total - b.total)
    .slice(0, 8);

  const history = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: true, room: true },
  });

  return { roomDemand, hourDemand, idleRooms, history };
}
