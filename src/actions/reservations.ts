"use server";

import { ReservationStatus, RoomStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { expireStaleReservations } from "@/lib/expire-reservations";
import {
  isSlotOverlapping,
  parseDateOnly,
  reservationExpiresAt,
} from "@/lib/reservations";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function createReservationAction(formData: FormData) {
  await expireStaleReservations();
  const session = await getSession();
  if (!session || !["ALUNO", "PROFESSOR"].includes(session.role)) {
    return { error: "Faça login como aluno ou professor para reservar." };
  }

  const roomId = String(formData.get("roomId") ?? "");
  const dateStr = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");

  if (!roomId || !dateStr || !startTime || !endTime) {
    return { error: "Preencha todos os campos." };
  }

  if (startTime >= endTime) {
    return { error: "Horário final deve ser após o inicial." };
  }

  const date = parseDateOnly(dateStr);
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return { error: "Sala não encontrada." };

  if (room.status === RoomStatus.OCUPADA) {
    return { error: "Sala indisponível no momento (chave em uso)." };
  }

  const conflicts = await prisma.reservation.findMany({
    where: {
      roomId,
      date,
      status: {
        in: [
          ReservationStatus.CONFIRMADA,
          ReservationStatus.ATIVA,
        ],
      },
    },
  });

  const hasConflict = conflicts.some((r) =>
    isSlotOverlapping(startTime, endTime, r.startTime, r.endTime),
  );

  if (hasConflict) {
    return { error: "Sala indisponível neste horário. Escolha outro intervalo." };
  }

  const expiresAt = reservationExpiresAt(date, startTime);

  await prisma.reservation.create({
    data: {
      userId: session.id,
      roomId,
      date,
      startTime,
      endTime,
      expiresAt,
      status: ReservationStatus.CONFIRMADA,
    },
  });

  revalidatePath("/painel");
  revalidatePath("/reservar");
  revalidatePath("/porteiro");
  return { success: true };
}
