FROM php:8.1-fpm

ENV TZ Asia/Tokyo

RUN apt-get update && \
	apt-get install -y git unzip libzip-dev libicu-dev libonig-dev nodejs npm libfreetype6-dev libjpeg62-turbo-dev libpng-dev && \
    docker-php-ext-install intl pdo_mysql zip bcmath gd

COPY ./docker/php.ini /usr/local/etc/php/php.ini

COPY --from=composer /usr/bin/composer /usr/bin/composer

# コンテナ内で使えるalias
RUN echo "alias ..='cd ..'"  >> ~/.bashrc && \
  echo "alias ...='cd ../..'"  >> ~/.bashrc && \
  echo "alias ll='ls -l'"  >> ~/.bashrc && \
  echo "alias lla='ls -la'"  >> ~/.bashrc && \
  echo "alias ..='cd ..'"  >> ~/.bashrc && \
  echo "alias ...='cd ../..'"  >> ~/.bashrc && \
# laravel
  echo "alias art='php artisan'"  >> ~/.bashrc && \
  echo "alias arts='art serve'"  >> ~/.bashrc && \
  echo "alias artr='art route:list'"  >> ~/.bashrc && \
  echo "alias migrate='art migrate'"  >> ~/.bashrc && \
  echo "alias seed='art db:seed'"  >> ~/.bashrc && \
  echo "alias rollback='art migrate:rollback'"  >> ~/.bashrc && \
  echo "alias fresh='art migrate:fresh'"  >> ~/.bashrc && \
  echo "alias cc='php artisan config:clear && php artisan cache:clear && php artisan view:clear'"  >> ~/.bashrc && \
  echo "alias cca='php artisan config:clear && php artisan cache:clear && php artisan view:clear && php artisan config:cache'"  >> ~/.bashrc && \
  echo "alias test='./vendor/bin/phpunit --testdox'"  >> ~/.bashrc && \
# git
  echo "alias gb='git branch'"  >> ~/.bashrc && \
  echo "alias gc='git checkout'"  >> ~/.bashrc && \
  echo "alias gcd='gc develop'"  >> ~/.bashrc && \
  echo "alias gcr='gc release'"  >> ~/.bashrc && \
  echo "alias gcs='gc stage'"  >> ~/.bashrc && \
  echo "alias gs='git status'"  >> ~/.bashrc && \
  echo "alias gp='git pull'"  >> ~/.bashrc

WORKDIR /app/sk_marche
