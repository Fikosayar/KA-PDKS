FROM node:20-alpine AS builder

WORKDIR /app

# Paket dosyalarını kopyala
COPY package.json package-lock.json* ./

# Tüm bağımlılıkları yükle (build için gerekli)
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Vite önyüzünü derle (Sunucularda OOM hatasını önlemek için bellek sınırını ayarlıyoruz)
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build

# --- Prodüksiyon Aşaması ---
FROM node:20-alpine

WORKDIR /app

# 1. Aşamanın bitmesini beklemeye zorlamak için önce build edilmiş dosyaları kopyalıyoruz.
# Böylece BuildKit iki npm install komutunu aynı anda çalıştırıp sunucunun RAM'ini tüketmez.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./

# Paket dosyalarını kopyala
COPY package.json package-lock.json* ./

# Sadece prodüksiyon bağımlılıklarını yükle
RUN npm install --omit=dev

# Sunucuyu çalıştırmak için tsx'i global kur
RUN npm install -g tsx

ENV NODE_ENV=production
EXPOSE 8105

# Sunucuyu başlat
CMD ["tsx", "server.ts"]
