#!/bin/sh
set -e

export BACKEND_UPSTREAM="${BACKEND_UPSTREAM:-http://backend:8080}"
export BACKEND_HOST="${BACKEND_HOST:-backend}"

envsubst '${BACKEND_UPSTREAM} ${BACKEND_HOST}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
