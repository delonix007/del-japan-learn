#!/bin/bash
# Run seed-quiz-4-50.sql ke Supabase
SUPABASE_URL="https://jhdrycdmifoctudnxvcz.supabase.co"
SUPABASE_KEY="sb_publishable_RYbJdhsJF0LsisZVG64glQ_YjVeREJf"

# Baca file SQL
SQL=$(cat seed-quiz-4-50.sql)

# Kirim ke Supabase REST API (menggunakan REST endpoint)
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/run_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\":\"$(echo "$SQL" | sed 's/"/\\"/g' | tr '\n' ' ' | sed "s/'/\\'/g")\"}" \
  || echo "Failed to run SQL via RPC"

# Fallback: gunakan psql jika tersedia
if command -v psql &> /dev/null; then
  echo "Using psql..."
  psql "$SUPABASE_URL" -f seed-quiz-4-50.sql
else
  echo "psql not available. Please run seed-quiz-4-50.sql manually in Supabase SQL Editor."
fi
