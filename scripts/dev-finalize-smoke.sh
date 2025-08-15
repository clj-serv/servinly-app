#!/bin/bash
# Smoke test for dev finalize API route

echo "Testing /api/dev/finalize endpoint..."

curl -i -X POST http://localhost:3000/api/dev/finalize \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "signals": {
      "roleId": "bartender",
      "roleFamily": "bar",
      "shineKeys": ["Customer-focused"],
      "busyKeys": [],
      "orgName": "Cool Bar",
      "startDate": "2024-01",
      "highlightText": "Consistently high CSAT",
      "responsibilities": ["Mix cocktails","Serve customers"]
    }
  }'

echo -e "\n\nExpected: 200 OK with {\"ok\":true,\"id\":\"...\"}"
