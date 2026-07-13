#!/bin/bash
# SKHD Health Check
# Registers skhd as a launchd user service and ensures it's started.
# Uses mkdir for atomic locking (portable on macOS).

LOG_FILE="/tmp/skhd_check.log"
LOCK_DIR="/tmp/skhd_check.lock"
SKHD_BIN="/opt/homebrew/bin/skhd"
SKHD_CONFIG="$HOME/.config/skhd/skhdrc"
ERR_LOG="/tmp/skhd_start_err.log"
SERVICE_LABEL="com.user.skhd-run"

# --- Lock ---
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] SKIP: already running" >> "$LOG_FILE"
    exit 0
fi
trap 'rm -rf "$LOCK_DIR" "$ERR_LOG"' EXIT

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# --- Main ---

# Check if service is already registered with launchd
if ! launchctl list | grep -q "$SERVICE_LABEL"; then
    log "Service $SERVICE_LABEL not registered, submitting..."
    launchctl submit -l "$SERVICE_LABEL" -p "$SKHD_BIN" -- -c "$SKHD_CONFIG" 2>"$ERR_LOG"
    if [ $? -ne 0 ] && [ -s "$ERR_LOG" ]; then
        ERR_MSG=$(cat "$ERR_LOG")
        log "Failed to submit service: $ERR_MSG"
        osascript -e 'display notification "SKHD: no se pudo registrar el servicio" with title "SKHD Error" sound name "Glass"'
        exit 1
    fi
    log "Service $SERVICE_LABEL submitted, starting..." >> "$LOG_FILE" 2>&1
else
    log "Service $SERVICE_LABEL already registered" >> "$LOG_FILE" 2>&1
fi

# Try to start the service (safe to call repeatedly)
launchctl start "gui/$(id -u)/$SERVICE_LABEL" 2>/dev/null

# Verify skhd is alive — if not, it'll start within ~30s via launchd
if pgrep -x "skhd" > /dev/null; then
    PID=$(pgrep -x skhd)
    log "SKHD is running (PID: $PID)"
    printf '%s' "$PID" > /tmp/skhd_saul.pid
    exit 0
else
    log "SKHD registered, waiting for launchd to start it"
    exit 0
fi
