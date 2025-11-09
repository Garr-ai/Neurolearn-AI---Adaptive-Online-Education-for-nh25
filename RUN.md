# How to Run NeuroCalm

## Quick Start

### Step 1: Install Node.js (if not installed)

Node.js is required for the React frontend. If you don't have it:

1. **Download Node.js**: Go to https://nodejs.org/ and download the LTS version
2. **Install it**: Run the installer
3. **Verify installation**: Open a new terminal and run:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 3: Start Backend Services

**Option A: Using the startup script (recommended)**

```bash
# Make sure you're in the project root
cd /Users/garr/Desktop/Neurocalm

# Activate virtual environment
source venv/bin/activate

# Run the startup script
./start_backend.sh
```

**Option B: Manual startup (2 terminals)**

Terminal 1 - FastAPI Server:
```bash
source venv/bin/activate
uvicorn backend.api:app --reload --port 8000
```

Terminal 2 - WebSocket Server:
```bash
source venv/bin/activate
python backend/websocket_server.py
```

### Step 4: Start Frontend (New Terminal)

```bash
cd frontend
npm start
```

The React app will automatically open in your browser at `http://localhost:3000`

## Access Points

- **Frontend Dashboard**: http://localhost:3000
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8765

## Troubleshooting

### "node: command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "npm: command not found"
- Install Node.js (npm comes with it)
- Restart your terminal

### Port already in use
- Kill the process using the port:
  ```bash
  # For port 8000
  lsof -ti:8000 | xargs kill -9
  
  # For port 3000
  lsof -ti:3000 | xargs kill -9
  ```

### Virtual environment not activated
- Make sure you run `source venv/bin/activate` before starting backend services
- You should see `(venv)` in your terminal prompt

### Module not found errors
- Backend: Make sure virtual environment is activated and run `pip install -r requirements.txt`
- Frontend: Run `npm install` in the `frontend` directory

