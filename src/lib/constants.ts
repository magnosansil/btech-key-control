export const LATE_TOLERANCE_MINUTES = Number(
  process.env.LATE_TOLERANCE_MINUTES ?? 15,
);

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Chave Fácil";

export const ROLE_LABELS = {
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  COORDENADOR: "Coordenador",
  PORTEIRO: "Porteiro",
} as const;

export const ROOM_TYPE_LABELS = {
  SALA_AULA: "Sala de aula",
  LABORATORIO: "Laboratório",
  SALA_REUNIAO: "Sala de reunião",
} as const;

export const IDENTIFIER_HINTS = {
  ALUNO: "Matrícula",
  PROFESSOR: "SIAPE",
  COORDENADOR: "SIAPE",
  PORTEIRO: "CPF (somente números)",
} as const;
