FROM php:8.3-apache

# Argomenti opzionali per il proxy
ARG PROXY_HOST
ARG PROXY_PORT

# Installa le estensioni PHP necessarie per MariaDB/MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Configura il proxy se fornito
RUN if [ -n "$PROXY_HOST" ] && [ -n "$PROXY_PORT" ]; then \
        echo "Acquire::http::Proxy \"http://$PROXY_HOST:$PROXY_PORT\";" > /etc/apt/apt.conf.d/proxy.conf && \
        echo "Acquire::https::Proxy \"http://$PROXY_HOST:$PROXY_PORT\";" >> /etc/apt/apt.conf.d/proxy.conf; \
    fi

# Installa pacchetti aggiuntivi utili
RUN apt-get update && apt-get install -y \
    vim \
    curl \
    zip \
    unzip \
    git \
    libzip-dev \
    && docker-php-ext-install zip

# Abilita mod_rewrite e mod_ssl di Apache
RUN a2enmod rewrite ssl

# Copia configurazione PHP personalizzata
COPY php.ini /usr/local/etc/php/

# Imposta i permessi corretti
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Espone le porte 80 e 443
EXPOSE 80 443

# Comando di avvio
CMD ["apache2-foreground"]
