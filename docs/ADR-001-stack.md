# ADR-001 — Stack do Sistema de Gestão de Chaves (Chave Fácil)

**Status:** Aceito (MVP)  
**Data:** Maio/2026  
**Contexto:** BTech Junior — orçamento zero, equipe com tempo limitado, manutenção simples.

## Contexto

O IFBA possui ~152 ambientes com chaves (102 salas, 40 laboratórios, 10 salas de reunião). O controle manual gera perda de dados, conflitos de uso e impossibilita consulta remota de disponibilidade. O porteiro (persona principal operacional) usa celular apenas para funções básicas.

## Decisão

| Camada | Tecnologia | Motivo |
|--------|------------|--------|
| Frontend | **Next.js 15 (App Router)** + **React 19** | Uma codebase para páginas públicas, área do porteiro e dashboard; SSR para painel sempre atualizado. |
| UI | **Tailwind CSS 4** + **shadcn/ui** | Componentes acessíveis, responsivos e consistentes sem design system proprietário. |
| Backend | **Server Actions** do Next.js | Evita API REST separada no MVP; menos código para a equipe manter. |
| Banco | **PostgreSQL** + **Prisma ORM** | Modelo relacional natural (usuários, salas, reservas, logs); migrations versionadas; fácil consulta analítica. |
| Hospedagem | **Vercel** (app) + **Neon/Supabase** (Postgres free tier) | Deploy gratuito com CI integrado; banco gerenciado sem servidor próprio. |
| Autenticação (MVP) | Sessão por cookie + identificador único | Sem OAuth/custos; adequado para ambiente controlado do campus. Evolução: NextAuth ou SSO institucional. |

### O que foi explicitamente rejeitado no MVP

- **QR Code na retirada:** resistência do porteiro e leitores inconsistentes; substituído por busca textual + botões grandes.
- **Firebase:** excelente para protótipo, porém consultas analíticas e histórico ficam mais complexos que SQL.
- **App nativo:** duplica esforço (iOS/Android) sem ganho para o MVP web mobile-first.

## Consequências

**Positivas:** stack familiar para devs web; custo operacional ~R$ 0 no free tier; Prisma acelera CRUD e seed das 152 salas.

**Negativas:** autenticação simplificada não é adequada para produção sem hardening; expiração de reservas depende de acesso ao sistema (cron futuro recomendado).

## Evolução planejada

1. Job cron (Vercel Cron) para `expireStaleReservations`.
2. Importação em lote das 152 salas via CSV/seed.
3. Notificações (e-mail/WhatsApp Business API) — fase 2.
