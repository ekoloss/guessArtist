###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16.18.0-alpine As development

WORKDIR /usr/src/app/client

EXPOSE ${CLIENT_PORT}

###################
# BUILD FOR PRODUCTION
###################

FROM node:16.18.0-alpine AS builder

WORKDIR /usr/src/app/client

COPY --chown=node:node client ./
COPY --chown=node:node models ../models

RUN npm ci

ENV NODE_ENV production

RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.23.1-alpine as production
ENV NODE_ENV production

EXPOSE 80
EXPOSE 443

WORKDIR /usr/src/app/client

COPY --from=builder /usr/src/app/client/build /usr/share/nginx/html
COPY client/nginx.conf /usr/src/app/nginx.conf.template

CMD ["/bin/sh" , "-c" , "envsubst '$SERVER_PORT' < /usr/src/app/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
