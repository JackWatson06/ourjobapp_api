FROM node:14.17.6-alpine

## Set the timezone to that of New York City
RUN apk add --no-cache tzdata
ENV TZ America/New_York

## As of 2023 the below code had to be change to properly load phantomjs. See this repo in order
## to build the dockerized-phantomjs.tar.gz file. Remember that when you do load up phantomjs you
## will get font warnings.
## https://github.com/everlytic/phantomized/tree/master
RUN apk add fontconfig ttf-dejavu
COPY dockerized-phantomjs.tar.gz /tmp/dockerized-phantomjs.tar.gz
RUN apk add --no-cache curl && \
    tar xzf /tmp/dockerized-phantomjs.tar.gz -C / && \
    cd /tmp && \
    curl -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
    rm -fR /tmp/* && \
    apk del curl

# https://stackoverflow.com/questions/45395390/see-cron-output-via-docker-logs-without-using-an-extra-file
COPY cron/crontab /etc/crontabs/root
CMD ([ -d node_modules ] || npm ci ) && crond && npm run dev
