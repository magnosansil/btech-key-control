# Deploy na Vercel — Chave Fácil

## Pré-requisitos

- Repositório no GitHub: `magnosansil/btech-key-control`
- Banco **Neon** (ou Supabase) com PostgreSQL
- Conta em [vercel.com](https://vercel.com)

## Passo 1 — URLs do Neon

No painel do Neon → seu projeto → **Connect**:

| Variável | Qual string copiar |
|----------|-------------------|
| `DATABASE_URL` | **Pooled connection** (host com `-pooler`) |
| `DIRECT_URL` | **Direct connection** (sem pooler) |

## Passo 2 — Importar projeto na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → escolha `magnosansil/btech-key-control`
3. Framework: **Next.js** (detectado automaticamente)
4. **Environment Variables** — adicione:

| Nome | Valor |
|------|--------|
| `DATABASE_URL` | URL pooled do Neon |
| `DIRECT_URL` | URL direct do Neon |
| `LATE_TOLERANCE_MINUTES` | `15` |
| `NEXT_PUBLIC_APP_NAME` | `Chave Fácil` |

5. Marque **Production**, **Preview** e **Development** para todas.
6. Clique em **Deploy**

O build roda `prisma migrate deploy` e cria as tabelas automaticamente.

## Passo 3 — Dados de demonstração (uma vez)

Após o primeiro deploy, no seu PC (com `.env` apontando para o Neon):

```bash
npm run db:seed
```

Isso popula usuários e reservas de teste no banco de produção.

## Passo 4 — Testar

Abra a URL gerada (ex.: `https://btech-key-control.vercel.app`):

- Porteiro: CPF `12345678901`
- Aluno: `2024001234`

## Deploy via CLI (opcional)

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add LATE_TOLERANCE_MINUTES
vercel env add NEXT_PUBLIC_APP_NAME
vercel --prod
```

## Problemas comuns

| Erro | Solução |
|------|---------|
| `P1001` / can't reach database | Confira `DATABASE_URL` e se o Neon não está pausado |
| Migration failed | Use `DIRECT_URL` sem pooler |
| Tabelas vazias | Rode `npm run db:seed` localmente apontando para o Neon |
| Build OK mas 500 na página | Variáveis de ambiente faltando na Vercel → **Settings → Environment Variables** |

## Atualizações futuras

Cada `git push` na branch `main` gera um novo deploy automático (se o projeto foi importado pelo GitHub).
