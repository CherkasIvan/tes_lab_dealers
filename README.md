<p align="center">
  <img src="https://api.mobility.hyundai.ru/public/images/HML-logo-black.png" width="320" alt="HYUNDAI Logo" />  
</p>

# COMMON BACK

## Platform
>* Postres 12
>* NodeJs >=16.13.1
>* NestJs 9.0.11

---

### Запуск


````shell
    yarn run start:dev
````


### Миграции

Принять все миграции

````shell 
    yarn run migrate up 
````

Повысить версию БД (Миграция на 1 шаг выше)


```` 
    yarn run migrate up 1
````

Понизить версию БД (Миграция на 1 шаг выше)

Миграция на 1 шаг ниже

```` 
    yarn run migrate down 1
````

Создать новый скрипт миграции бд


```` 
    yarn run migrate create migrate_name 
````

---

## Правила именования

#### Таблицы

Имена таблиц в нижнем регистре через подчеркивание или в одно слово

    projects  
    org_status

Имена столбцов в нижнем регистре через подчеркивание

    org_id  
    status

имя таблицы, прямо относящаяся к другой, родительской, должно начинаться с имени родительской таблицы

    org
    org_status

    vehicles
    vehicle_status

### Setting up a development environment

#### Настройка среды разработки

#### 1. Install Local Postgres 12

#### Установить локальный Postgres 12

##### Installing using Docker compose

##### Установка с помощью Docker compose

1. Install Docker on machine (Установить Docker на машину)

   [Get docker: https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

1. Start docker container (Запустить докер контейнер)


````shell
    cd developer.env/postgres/
    docker-compose up -d --build
````


> [pgAdmin4](http://localhost:5050/) - admin: `admin@admin.com` pass: `123456`

##### Installing into local machine

##### Alternative option

##### Установка на локальную машину

#### Альтернативный вариант

[Установка Postgres 12](https://yandex.ru/search/?text=%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%20postgresql%2012&lr=10740&clid=2270455&win=393)

[Installing into local machine](https://www.google.ru/search?ie=UTF-8&hl=ru&q=install%20postgresql%2012)

#### 2. Preparing database

#### Подготовка базы данных

Connect to postgress and create role and database
(Подключиться к postgres и создать роль и базу данных):


````sql92
    CREATE ROLE common_back_dev WITH LOGIN PASSWORD '12345678';
    CREATE DATABASE "common-back-dev" OWNER common_back_dev;
    ALTER USER common_back_dev WITH SUPERUSER;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
````


#### 3. Preparing config files

#### Подготовка файлов конфигурации

Create `.env` file

````dotenv
    IS_PRODUCT=false

    # Nest
    SERVER_PORT=3041
    
    # Logs
    LOG_DIR=./logs
    APP_LOGGER_DEBUG=on
    DISABLE_REQUEST_LOG=false
    
    # PostgreSQL
    DATABASE_URL=postgresql://test:123456@127.0.0.1:5432/test
    
    # Clickhouse
    CLICKHOUSE_URL=http://127.0.0.1/
    CLICKHOUSE_DB=common_back
    
    # RabbitMQ
    AMQP_URI=amqp://radmin:123456@127.0.0.1:5672/
    
    # Mongo
    MONGO_URL=mongodb://test:test@127.0.0.1:27017/test
````

#### 4. Install NestJs

#### Установить NestJs.

````shell 
npm i -g @nestjs/cli
````
[Nest](https://docs.nestjs.com/) framework documentation.

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

#### 5. Using Yarn for install dependence

#### Использование Yarn для установки зависимостей

[Yarn](https://yarnpkg.com/getting-started/install)

````shell 
    yarn install
````

#### 6. Run migration scripts

#### Запустить скрипты миграции

````shell 
    yarn run migrate up 
````

#### 7. Config your IDE for using Yarn

#### Настроить свою IDE для использования Yarn


# tes_lab_dealers
