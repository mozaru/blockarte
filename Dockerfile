FROM alpine:latest

# Instala o busybox (já vem em Alpine, mas garantimos)
RUN apk add --no-cache busybox

# Cria diretório para servir os arquivos
WORKDIR /www

# Copia o conteúdo do jogo para dentro do container
COPY index.html /www
COPY css /www/css
COPY js /www/js
COPY assets /www/assets

RUN chmod -R 755 /www

# Expõe a porta padrão
EXPOSE 80

# Inicia o servidor HTTP do busybox em modo foreground
CMD ["busybox", "httpd", "-f", "-p", "80"]
