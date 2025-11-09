# Quick Setup Guide

## Prerequisites

1. **Python 3.8+** - Check with `python3 --version`
2. **Node.js 16+ and npm** - Check with `node --version` and `npm --version`
   - If not installed, download from [nodejs.org](https://nodejs.org/)

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to project directory
cd /Users/garr/Desktop/Neurocalm

# Create virtual environment (if not already created)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Return to project root
cd ..
```

### 3. Start the Application

**Option A: Using the startup script (recommended)**

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Start backend services
./start_backend.sh

# In a new terminal, start frontend
cd frontend
npm start
```

**Option B: Manual startup**

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

Terminal 3 - React Frontend:
```bash
cd frontend
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8765

## Testing Without OpenBCI Hardware

The system uses a synthetic board by default, so you can test without hardware. To use real OpenBCI hardware, modify `backend/eeg_service.py`:

```python
# Change from:
board_id = BoardIds.SYNTHETIC_BOARD

# To:
board_id = BoardIds.CYTON_BOARD  # or GANGLION_BOARD
```

## Troubleshooting

### Python Import Errors
- Make sure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### npm Command Not Found
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation

### Port Already in Use
- Change ports in configuration files
- Or kill the process using the port:
  ```bash
  # Find process using port 8000
  lsof -ti:8000 | xargs kill -9
  ```

### Database Errors
- Delete `neurocalm.db` and restart (database will be recreated)
- Check file permissions in project directory

## Next Steps

1. Go to **Calibrate** page to establish baseline
2. Start recording on **Dashboard**
3. Switch between modes (Meetings, Study, Lectures, Health Journal)
4. View **History** to see past sessions

