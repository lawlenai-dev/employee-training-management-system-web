# ---- build stage ----
FROM node:22-alpine AS build

WORKDIR /app

# Vite inlines VITE_* at build time, so it must be an ARG, not a runtime variable.
# On Railway set this as a build variable (e.g. https://chk-api.up.railway.app/api).
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime stage ----
FROM nginx:1.27-alpine

# nginx's entrypoint runs envsubst over /etc/nginx/templates/*.template,
# which lets the server listen on Railway's injected $PORT.
ENV PORT=8080

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
