#!/bin/sh
set -eu

config_file=${CONFIG_FILE:-/usr/share/nginx/html/conf/config.js}

if [ ! -f "$config_file" ]; then
  exit 0
fi

escape_sed_replacement() {
  printf '%s' "$1" | sed 's/[\\&|]/\\&/g'
}

replace_url() {
  key=$1
  value=$2

  if [ -z "$value" ]; then
    return
  fi

  value=${value%/}
  escaped=$(escape_sed_replacement "$value")
  temp_file=$(mktemp)
  sed "s|^  ${key}: .*|  ${key}: '${escaped}',|" "$config_file" > "$temp_file"
  cat "$temp_file" > "$config_file"
  rm -f "$temp_file"
}

replace_url apiUrl "${API_URL:-}"
replace_url shortUrl "${SHORT_URL:-}"

if [ -n "${SITE_NAME:-}" ]; then
  escaped=$(escape_sed_replacement "$SITE_NAME")
  temp_file=$(mktemp)
  sed "s|^  siteName: .*|  siteName: \`${escaped}\`,|" "$config_file" > "$temp_file"
  cat "$temp_file" > "$config_file"
  rm -f "$temp_file"
fi
