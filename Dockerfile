# --- Etapa 1: Base (Skeleton) ---
FROM node:22.16-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# --- Etapa 2: Construcción (SDK Stage) ---
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

# Desactivar telemetría de Vercel durante el build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# --- Etapa 3: Producción (Runtime Stage) ---
FROM node:22.16-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copiar la carpeta public
COPY --from=builder /app/public ./public

# Crear carpeta .next con permisos correctos
RUN mkdir .next
RUN chown nextjs:nodejs .next

# El build standalone genera un archivo server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Los archivos estáticos no se incluyen en standalone, hay que copiarlos
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
# Escuchar en todas las interfaces de red del contenedor
ENV HOSTNAME="0.0.0.0" 

CMD ["node", "server.js"]