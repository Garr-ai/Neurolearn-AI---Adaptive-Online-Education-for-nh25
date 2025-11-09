#!/bin/bash
# Start backend services

# Get script directory and change to project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Activate virtual environment
source venv/bin/activate

# Kill any existing processes on these ports
echo "Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:8765 | xargs kill -9 2>/dev/null || true
sleep 2
echo "Ports cleared"

# Start FastAPI server in background
uvicorn backend.api:app --reload --port 8000 &
API_PID=$!

# Start WebSocket server (run as module to fix imports)
python -m backend.websocket_server &
WS_PID=$!

echo "Backend services started!"
echo "FastAPI: http://localhost:8000"
echo "WebSocket: ws://localhost:8765"
echo "Press Ctrl+C to stop"

# Wait for interrupt
trap "kill $API_PID $WS_PID 2>/dev/null; exit" INT TERM
wait
