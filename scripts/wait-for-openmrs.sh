#!/usr/bin/env bash
# scripts/wait-for-openmrs.sh
#
# Polls the OpenMRS instance until it's reachable AND fully initialized.
#
# Two failure modes handled:
#   - First-run setup wizard still running (polls /initialsetup for status).
#   - Login page returns 200 but app tiles haven't fully loaded yet.
#
# Default timeout: 15 minutes (the O3 Reference Application's first-boot
# Liquibase migrations + module upgrades can take that long on slow disks).

set -euo pipefail

URL="${OPENMRS_URL:-http://localhost:8088/openmrs/login.htm}"
TIMEOUT="${OPENMRS_TIMEOUT:-900}"   # seconds
INTERVAL="${OPENMRS_INTERVAL:-5}"    # seconds

echo "Waiting for OpenMRS at $URL (timeout ${TIMEOUT}s)…"
start=$(date +%s)
attempt=0

while true; do
  attempt=$((attempt + 1))
  now=$(date +%s)
  elapsed=$((now - start))

  # Probe the login page (skip redirects)
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "$URL" || echo "000")

  if [ "$status" = "200" ]; then
    # If we're seeing the first-run wizard, poll its progress endpoint.
    wizard_html=$(curl -s --max-time 3 "http://localhost:8088/openmrs/initialsetup" || echo "")
    if echo "$wizard_html" | grep -q "initializationComplete"; then
      progress=$(curl -s --max-time 3 "http://localhost:8088/openmrs/initialsetup?page=progress.vm.ajaxRequest" || echo "")
      if echo "$progress" | grep -q '"initializationComplete":true'; then
        echo ""
        echo "✓ OpenMRS wizard reports initialization complete."
        break
      fi
      # Wizard still running — keep waiting silently.
      printf "."
    else
      # No wizard — we're past initial setup. Verify by trying API auth.
      api_status=$(curl -s -o /dev/null -w "%{http_code}" -u admin:Admin123 --max-time 5 "http://localhost:8088/openmrs/ws/rest/v1/session" || echo "000")
      if [ "$api_status" = "200" ]; then
        echo ""
        echo "✓ OpenMRS ready after ${elapsed}s ($attempt probes)."
        echo ""
        echo "  URL:      $URL"
        echo "  Username: admin"
        echo "  Password: Admin123"
        echo ""
        echo "Run: npm test"
        exit 0
      fi
      printf "."
    fi
  fi

  if [ "$elapsed" -ge "$TIMEOUT" ]; then
    echo ""
    echo "✗ Timed out after ${TIMEOUT}s."
    echo "  Check progress with: docker compose logs -f openmrs"
    exit 1
  fi

  sleep "$INTERVAL"
done
