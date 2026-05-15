# Chave Fácil — Gestão de Chaves (MVP)

Sistema web para automatizar o fluxo **Chave Reservation**: reserva prévia, entrega/devolução na guarita, painel público de disponibilidade e dashboard da coordenação.

## Stack

- Next.js 15 · React 19 · Tailwind 4 · shadcn/ui
- PostgreSQL · Prisma ORM

## Início rápido

```bash
npm run db:up

cp .env.example .env

npm run db:migrate
npm run db:seed

npm run dev
```

Acesse http://localhost:3000

### Usuários de demonstração

| Perfil              | Identificador          |
| ------------------- | ---------------------- |
| Porteiro (João)     | CPF `12345678901`      |
| Professor (Ana)     | SIAPE `1234567`        |
| Aluno (Lucas)       | Matrícula `2024001234` |
| Coordenador (Maria) | SIAPE `7654321`        |

## Fluxo (resumo)

1. **Aluno/Professor:** reserva em `/reservar` → aparece em “Chaves para entregar” do porteiro.
2. **Porteiro:** `/porteiro` → busca nome → **Entregar chave** (sala fica ocupada).
3. **Devolução:** aba Receber → **Receber chave**.
4. **Todos:** `/painel` — status livre/ocupado e responsável atual.
5. **Coordenador:** `/coordenador` — gráficos e histórico.

Reservas não retiradas em **15 min** após o horário inicial expiram automaticamente (configurável via `LATE_TOLERANCE_MINUTES`).

## Acessibilidade

Botão **A / A+ / A++** no cabeçalho aumenta a fonte global (persistido no navegador). Interface mobile-first com alvos de toque amplos para o porteiro.

## Deploy na Vercel

Guia completo: **[docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md)**

Resumo:

1. Importe o repo `magnosansil/btech-key-control` em [vercel.com/new](https://vercel.com/new)
2. Configure no painel da Vercel:
   - `DATABASE_URL` (Neon pooled)
   - `DIRECT_URL` (Neon direct, para migrations)
   - `LATE_TOLERANCE_MINUTES=15`
   - `NEXT_PUBLIC_APP_NAME=Chave Fácil`
3. Deploy → depois rode `npm run db:seed` uma vez (com `.env` apontando para o Neon)
