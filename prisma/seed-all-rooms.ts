/**
 * Script opcional: gera as 152 salas do campus (102 aulas + 40 labs + 10 reuniões).
 * Uso: npx tsx prisma/seed-all-rooms.ts
 */
import { PrismaClient, RoomType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rooms: {
    number: string;
    name: string;
    type: RoomType;
    building: string;
  }[] = [];

  for (let i = 1; i <= 102; i++) {
    const n = String(100 + i);
    rooms.push({
      number: n,
      name: `Sala de aula ${n}`,
      type: RoomType.SALA_AULA,
      building: i <= 50 ? "Bloco A" : "Bloco B",
    });
  }

  for (let i = 1; i <= 40; i++) {
    const num = `LAB-${String(i).padStart(2, "0")}`;
    rooms.push({
      number: num,
      name: `Laboratório ${i}`,
      type: RoomType.LABORATORIO,
      building: "Bloco C",
    });
  }

  for (let i = 1; i <= 10; i++) {
    const num = `REU-${String(i).padStart(2, "0")}`;
    rooms.push({
      number: num,
      name: `Sala de reunião ${i}`,
      type: RoomType.SALA_REUNIAO,
      building: "Bloco A",
    });
  }

  for (const r of rooms) {
    await prisma.room.upsert({
      where: { number: r.number },
      update: r,
      create: r,
    });
  }

  console.log(`Cadastradas ${rooms.length} salas.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
