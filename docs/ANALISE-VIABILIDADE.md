# Análise de Viabilidade — Chave Fácil

## 1. Resumo executivo

A solução proposta é **viável** para um MVP desenvolvido por uma empresa júnior, com **alta viabilidade técnica e econômica**, **média operacional** (depende de adoção do porteiro) e **alta viabilidade temporal** (4–6 semanas para MVP completo com 152 salas cadastradas).

## 2. Dimensionamento de uso (estimativa IFBA)

| Perfil | Estimativa | Uso típico |
|--------|------------|------------|
| Porteiros | 2–4 | 50–150 operações/dia (entrega + devolução) |
| Alunos | 800–3.000 | 5–15% consultam painel; 20–80 reservas/dia |
| Professores | 80–150 | 30–60 reservas/dia |
| Coordenação | 3–8 | Dashboard 2–5×/semana |

**Pico simultâneo conservador:** 30–80 usuários (horário de troca de aula).  
**Requisições/dia (MVP):** ~500–2.000 — bem dentro do free tier Vercel + Neon.

## 3. Matriz de viabilidade

| Critério | Status | Justificativa |
|----------|--------|---------------|
| **Técnica** | Alta | Stack web mainstream; equipe BTech com React/TS; Prisma reduz risco de SQL manual. |
| **Econômica** | Alta | Desenvolvimento interno; infra R$ 0–50/mês no início (ver custos). |
| **Operacional** | Média | João (porteiro) precisa de interface com botões grandes, sem QR; treinamento de 1–2 h. |
| **Temporal** | Alta | MVP core em 2–3 sprints; cadastro das 152 salas em 1 sprint paralelo. |
| **Legal/LGPD** | Média | Trata matrícula/SIAPE/CPF — política de retenção e consentimento necessários antes de produção. |

## 4. Custos estimados

### 4.1 Desenvolvimento (criação)

| Item | Horas est. | Observação |
|------|------------|------------|
| Modelagem + Prisma + seed | 16–24 h | Inclui import das 152 salas |
| Telas porteiro (entregar/receber) | 20–28 h | UX crítica |
| Painel + reserva | 16–20 h | |
| Dashboard coordenador | 12–16 h | |
| ADR, fluxos, apresentação | 8–12 h | Entregável do desafio |
| Testes + ajustes | 12–16 h | |
| **Total MVP** | **84–116 h** | ~3–4 devs × 3–4 semanas em meio período |

*Custo financeiro direto:* R$ 0 se equipe júnior voluntária; oportunidade ≈ R$ 8.400–16.000 se hora técnica R$ 100–140 (referência mercado júnior).

### 4.2 Deploy e operação (mensal)

| Serviço | Plano | Custo/mês |
|---------|-------|-----------|
| Vercel (Next.js) | Hobby | R$ 0 |
| Neon / Supabase (Postgres) | Free tier | R$ 0 |
| Domínio .edu.br ou .ifba.edu.br | Institucional | R$ 0 (TI) |
| **Total típico MVP** | | **R$ 0** |
| Escala (>100k req/mês) | Vercel Pro + DB paid | R$ 100–350 |

### 4.3 Custos indiretos

- Tablets/celular na guarita: já existente.
- Impressão de cartazes com URL do painel (opcional): R$ 20–50.
- Treinamento portaria: 2 h × 2 pessoas (custo operacional, não de software).

## 5. Riscos e mitigação

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Porteiro não adota | Alto | UI minimalista, fonte ampliável, treinamento presencial |
| Conflito de reserva | Médio | Validação de sobreposição de horários no servidor |
| Reserva sem comparecimento | Médio | Tolerância configurável (15 min) + expiração automática |
| Queda do sistema | Médio | Fallback para caderno; status em tempo real após retorno |
| Dados pessoais | Médio | Política LGPD; minimizar campos; não expor CPF no painel público |

## 6. Comparativo: processo atual vs proposto

| Aspecto | Manual (caderno) | Chave Fácil (MVP) |
|---------|------------------|----------------|
| Consulta disponibilidade | Presencial | Web 24/7 |
| Rastreabilidade | Rasuras/perda | Histórico digital |
| Troca de turno porteiro | Memória oral | Lista “ocupadas” em tempo real |
| Indicadores gestão | Inexistente | Dashboard Maria |
| Custo | Baixo | Baixo (cloud free) |

## 7. Conclusão

O projeto atende às restrições da BTech (tempo, orçamento, manutenção) e resolve as dores do desafio IFBA. O MVP em Next.js + PostgreSQL + Prisma é a escolha mais equilibrada entre **simplicidade**, **escalabilidade futura** e **adequação às personas** (especialmente o porteiro, sem QR Code).

**Recomendação:** aprovar MVP, piloto em 6 salas por 2 semanas, depois rollout das 152 salas.
