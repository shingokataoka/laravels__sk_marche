FROM php:8.1-fpm

ENV TZ UTC

# コンテナ内にユーザーを作成する。
RUN groupadd -g 1001 1001 && \
    useradd -m -u 1001 -g 1001 username


# &&について。「コマンド１ && コマンド2」のようにつないで書ける。
# \ はRUNの中のコマンドを改行できる。
# apt-get updateはインストールリストを更新する。
# つまり、最初にapt-get updateしないとapt-get installはできない。
RUN apt-get update && \
	apt-get install -y \
  # 必要そうなのをインストール。
  git unzip libzip-dev libicu-dev libonig-dev nodejs npm libfreetype6-dev \
  # gdライブラリ関連をインストール
  libpng-dev libjpeg62-turbo-dev &&\
  #  -- docker-php-ext-configureはphp拡張モジュールの設定を変更できるコマンド --
  docker-php-ext-configure \
  # gdライブラリのphp拡張モジュールの設定を変更する
   gd --with-jpeg &&\
  # -- 設定変換後なので、インストールし直すコマンド --
  docker-php-ext-install \
  # 必要そうなのをインストール（し直す？）。
  intl pdo_mysql zip bcmath \
  # gdライブラリをインストールし直す。-j$(nproc)はコア数を教えて速く動作するらしい。
  -j$(nproc) gd


# 作成したユーザーに権限を与える。
COPY --chown=$UID:$GID ./app/ /usr/src/app

# 左側は、docker compose up -d でするなら、docker-compose.ymlからのパス。
COPY ./docker/php.ini /usr/local/etc/php/php.ini
# 「--from=イメージA イメージA内のファイルパス 今コンテナ内のパス」で、直接composerイメージのファイルを今コンテナにコピペする。
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

# docker compose exec サービスコンテナ名 bash で入った時のフォルダ
WORKDIR /app/sk_marche
