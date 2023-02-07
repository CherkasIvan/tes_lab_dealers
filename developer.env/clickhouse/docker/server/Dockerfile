FROM ubuntu:20.04

RUN apt-get install apt-transport-https ca-certificates dirmngr && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E0C56BD4
RUN echo "deb https://repo.clickhouse.tech/deb/stable/ main/" | sudo tee  /etc/apt/sources.list.d/clickhouse.list
RUN apt-get update && apt-get install -y clickhouse-server clickhouse-client
RUN service clickhouse-server start
RUN clickhouse-client

