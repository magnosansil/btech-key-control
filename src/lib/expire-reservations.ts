import { ReservationStatus } from "@prisma/client";
import { prisma } from "./prisma";

/** Libera reservas que passaram do prazo sem retirada da chave. */
export async function expireStaleReservations() {
  const now = new Date();
  await prisma.reservation.updateMany({
    where: {
      status: ReservationStatus.CONFIRMADA,
      expiresAt: { lt: now },
    },
    data: { status: ReservationStatus.EXPIRADA },
  });
}
