import {
  PrismaClient,
  ReservationStatus,
  RoomStatus,
  RoomType,
  UserRole,
} from "@prisma/client";
import { addDays, startOfDay, subDays } from "date-fns";
import { reservationExpiresAt } from "../src/lib/reservations";

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "João Silva", role: UserRole.PORTEIRO, identifier: "12345678901" },
    { name: "Ana Costa", role: UserRole.PROFESSOR, identifier: "1234567" },
    { name: "Lucas Mendes", role: UserRole.ALUNO, identifier: "2024001234" },
    { name: "Maria Santos", role: UserRole.COORDENADOR, identifier: "7654321" },
    { name: "Pedro Alves", role: UserRole.ALUNO, identifier: "2024005678" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { identifier: u.identifier },
      update: { name: u.name, role: u.role },
      create: u,
    });
  }

  const rooms = [
    { number: "101", name: "Sala 101", type: RoomType.SALA_AULA, building: "Bloco A" },
    { number: "102", name: "Sala 102", type: RoomType.SALA_AULA, building: "Bloco A" },
    { number: "201", name: "Sala 201", type: RoomType.SALA_AULA, building: "Bloco B" },
    { number: "LAB-01", name: "Lab. Redes 01", type: RoomType.LABORATORIO, building: "Bloco C" },
    { number: "LAB-02", name: "Lab. Informática 02", type: RoomType.LABORATORIO, building: "Bloco C" },
    { number: "REU-01", name: "Sala de Reuniões", type: RoomType.SALA_REUNIAO, building: "Bloco A" },
  ];

  for (const r of rooms) {
    await prisma.room.upsert({
      where: { number: r.number },
      update: {
        name: r.name,
        type: r.type,
        building: r.building,
        status: RoomStatus.LIVRE,
        currentHolderId: null,
      },
      create: r,
    });
  }

  const ana = await prisma.user.findUniqueOrThrow({
    where: { identifier: "1234567" },
  });
  const lucas = await prisma.user.findUniqueOrThrow({
    where: { identifier: "2024001234" },
  });
  const pedro = await prisma.user.findUniqueOrThrow({
    where: { identifier: "2024005678" },
  });

  const room101 = await prisma.room.findUniqueOrThrow({ where: { number: "101" } });
  const room102 = await prisma.room.findUniqueOrThrow({ where: { number: "102" } });
  const room201 = await prisma.room.findUniqueOrThrow({ where: { number: "201" } });
  const roomLab1 = await prisma.room.findUniqueOrThrow({ where: { number: "LAB-01" } });
  const roomLab2 = await prisma.room.findUniqueOrThrow({ where: { number: "LAB-02" } });
  const roomReu = await prisma.room.findUniqueOrThrow({ where: { number: "REU-01" } });

  await prisma.keyLog.deleteMany();
  await prisma.reservation.deleteMany();

  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(today, 1));
  const yesterday = startOfDay(subDays(today, 1));
  // —— Aguardando entrega na guarita (CONFIRMADA, hoje) ——
  const pendingDeliveries = [
    {
      userId: lucas.id,
      roomId: room101.id,
      date: today,
      startTime: "08:00",
      endTime: "10:00",
    },
    {
      userId: ana.id,
      roomId: roomLab1.id,
      date: today,
      startTime: "10:00",
      endTime: "12:00",
    },
    {
      userId: pedro.id,
      roomId: roomReu.id,
      date: today,
      startTime: "14:00",
      endTime: "16:00",
    },
    {
      userId: lucas.id,
      roomId: room201.id,
      date: tomorrow,
      startTime: "09:00",
      endTime: "11:00",
    },
  ];

  for (const r of pendingDeliveries) {
    await prisma.reservation.create({
      data: {
        ...r,
        status: ReservationStatus.CONFIRMADA,
        expiresAt: reservationExpiresAt(r.date, r.startTime),
      },
    });
  }

  // —— Chave em uso agora (ATIVA + sala OCUPADA) ——
  const activePickup = new Date();
  activePickup.setHours(activePickup.getHours() - 1);

  const activeReservation = await prisma.reservation.create({
    data: {
      userId: ana.id,
      roomId: roomLab2.id,
      date: today,
      startTime: "13:00",
      endTime: "15:00",
      status: ReservationStatus.ATIVA,
      pickedUpAt: activePickup,
      expiresAt: reservationExpiresAt(today, "13:00"),
    },
  });

  await prisma.room.update({
    where: { id: roomLab2.id },
    data: {
      status: RoomStatus.OCUPADA,
      currentHolderId: ana.id,
    },
  });

  await prisma.keyLog.create({
    data: {
      roomId: roomLab2.id,
      userId: ana.id,
      action: "ENTREGA",
      reservationId: activeReservation.id,
      createdAt: activePickup,
    },
  });

  // —— Histórico para dashboard (CONCLUIDA / EXPIRADA) ——
  const completed = [
    {
      userId: pedro.id,
      roomId: room102.id,
      date: yesterday,
      startTime: "08:00",
      endTime: "10:00",
      status: ReservationStatus.CONCLUIDA,
      pickedUpAt: subDays(new Date(), 1),
      returnedAt: subDays(new Date(), 1),
    },
    {
      userId: ana.id,
      roomId: room101.id,
      date: yesterday,
      startTime: "14:00",
      endTime: "16:00",
      status: ReservationStatus.CONCLUIDA,
      pickedUpAt: subDays(new Date(), 1),
      returnedAt: subDays(new Date(), 1),
    },
    {
      userId: lucas.id,
      roomId: roomLab1.id,
      date: subDays(today, 2),
      startTime: "10:00",
      endTime: "12:00",
      status: ReservationStatus.CONCLUIDA,
      pickedUpAt: subDays(new Date(), 2),
      returnedAt: subDays(new Date(), 2),
    },
    {
      userId: pedro.id,
      roomId: room201.id,
      date: yesterday,
      startTime: "16:00",
      endTime: "18:00",
      status: ReservationStatus.EXPIRADA,
      expiresAt: subDays(new Date(), 1),
    },
  ];

  for (const r of completed) {
    const { pickedUpAt, returnedAt, expiresAt, status, ...data } = r;
    await prisma.reservation.create({
      data: {
        ...data,
        status,
        pickedUpAt: pickedUpAt ?? undefined,
        returnedAt: returnedAt ?? undefined,
        expiresAt: expiresAt ?? reservationExpiresAt(data.date, data.startTime),
      },
    });
  }

  for (const r of completed.filter((c) => c.status === ReservationStatus.CONCLUIDA)) {
    await prisma.keyLog.createMany({
      data: [
        {
          roomId: r.roomId,
          userId: r.userId,
          action: "ENTREGA",
          createdAt: r.pickedUpAt!,
        },
        {
          roomId: r.roomId,
          userId: r.userId,
          action: "DEVOLUCAO",
          createdAt: r.returnedAt!,
        },
      ],
    });
  }

  console.log("Seed concluído:");
  console.log(`  • ${pendingDeliveries.length} reservas aguardando entrega (aba Entregar)`);
  console.log("  • 1 chave em uso — LAB-02 com Ana (aba Receber)");
  console.log(`  • ${completed.length} registros de histórico (dashboard)`);
  console.log("  Porteiro: CPF 12345678901 | Aluno: 2024001234 | Professor: 1234567");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
