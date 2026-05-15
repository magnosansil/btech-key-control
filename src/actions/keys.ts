"use server";

import { ReservationStatus, RoomStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { expireStaleReservations } from "@/lib/expire-reservations";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function deliverKeyAction(reservationId: string) {
  await expireStaleReservations();
  const session = await getSession();
  if (!session || session.role !== "PORTEIRO") {
    return { error: "Acesso negado." };
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { room: true, user: true },
  });

  if (!reservation || reservation.status !== ReservationStatus.CONFIRMADA) {
    return { error: "Reserva indisponível para entrega." };
  }

  if (reservation.room.status === RoomStatus.OCUPADA) {
    return { error: "Sala já está ocupada." };
  }

  await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: ReservationStatus.ATIVA,
        pickedUpAt: new Date(),
      },
    }),
    prisma.room.update({
      where: { id: reservation.roomId },
      data: {
        status: RoomStatus.OCUPADA,
        currentHolderId: reservation.userId,
      },
    }),
    prisma.keyLog.create({
      data: {
        roomId: reservation.roomId,
        userId: reservation.userId,
        action: "ENTREGA",
        reservationId,
      },
    }),
  ]);

  revalidatePath("/porteiro");
  revalidatePath("/painel");
  return { success: true };
}

export async function receiveKeyAction(roomId: string) {
  await expireStaleReservations();
  const session = await getSession();
  if (!session || session.role !== "PORTEIRO") {
    return { error: "Acesso negado." };
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      currentHolder: true,
      reservations: {
        where: { status: ReservationStatus.ATIVA },
        take: 1,
      },
    },
  });

  if (!room || room.status !== RoomStatus.OCUPADA) {
    return { error: "Chave não está em uso." };
  }

  const activeReservation = room.reservations[0];

  await prisma.$transaction([
    ...(activeReservation
      ? [
          prisma.reservation.update({
            where: { id: activeReservation.id },
            data: {
              status: ReservationStatus.CONCLUIDA,
              returnedAt: new Date(),
            },
          }),
        ]
      : []),
    prisma.room.update({
      where: { id: roomId },
      data: { status: RoomStatus.LIVRE, currentHolderId: null },
    }),
    prisma.keyLog.create({
      data: {
        roomId,
        userId: room.currentHolderId!,
        action: "DEVOLUCAO",
        reservationId: activeReservation?.id,
      },
    }),
  ]);

  revalidatePath("/porteiro");
  revalidatePath("/painel");
  revalidatePath("/coordenador");
  return { success: true };
}
