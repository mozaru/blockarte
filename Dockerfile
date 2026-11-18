FROM busybox:stable

# Usuário sem privilégios
RUN adduser -D -u 10001 app

# Conteúdo do jogo (estático)
WORKDIR /www
COPY --chown=app:app index.html /www/
COPY --chown=app:app css /www/css
COPY --chown=app:app js /www/js
COPY --chown=app:app assets /www/assets

# Porta interna do container (o Traefik encaminha para ela)
EXPOSE 8080

# Healthcheck simples
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

# Rodar como não-root na porta alta (não precisa de CAP_NET_BIND_SERVICE)
USER 10001:10001

# Servir com o httpd do busybox
# -f: foreground  | -p: porta | -h: docroot
CMD ["httpd", "-f", "-p", "8080", "-h", "/www"]
