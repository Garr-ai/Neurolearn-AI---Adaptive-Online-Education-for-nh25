# How the "Start Recording" Button Works

## Flow Diagram

```
Frontend (React)                    Backend (Python)                    Ganglion Board
     |                                    |                                  |
     | 1. User clicks "Start Recording"  |                                  |
     |----------------------------------->|                                  |
     |                                    | 2. Receives start_recording msg  |
     |                                    |----------------------------------->|
     |                                    | 3. Connects to Ganglion           |
     |                                    |    (Bluetooth or USB)             |
     |                                    |<----------------------------------|
     |                                    | 4. Starts streaming EEG data      |
     |                                    |                                  |
     |<-----------------------------------| 5. Sends "recording_started"     |
     | 6. Updates UI: "Recording..."     |                                  |
     |                                    |                                  |
     |                                    | 7. Continuously reads EEG         |
     |                                    |    and calculates band powers    |
     |                                    |                                  |
     |<-----------------------------------| 8. Sends eeg_data every second    |
     | 9. Updates charts and scores       |                                  |
     |                                    |                                  |
```

## Step-by-Step Breakdown

### 1. Frontend: Button Click
When you click "Start Recording":
- Checks if WebSocket is connected
- Sends `{"type": "start_recording"}` message via WebSocket
- Shows "Connecting to Ganglion..." status

### 2. Backend: Receives Message
The WebSocket server receives the message:
- Checks if EEG service is already streaming
- Gets connection parameters (MAC address or serial port) from:
  - Environment variables (`.env` file)
  - Or message data
  - Or tries auto-detect

### 3. Backend: Connects to Ganglion
The backend attempts to connect:
- **Bluetooth**: Uses MAC address (e.g., `00:A0:C9:14:C8:29`)
- **USB**: Uses serial port (e.g., `/dev/tty.usbserial-XXXXX`)
- **Auto-detect**: Tries to find Ganglion automatically

### 4. Backend: Starts Streaming
Once connected:
- Starts the EEG data stream
- Begins calculating band powers (alpha, beta, theta, gamma)
- Calculates scores (focus, load, anomaly)
- Sends data to frontend every second

### 5. Frontend: Updates UI
The frontend receives:
- `recording_started` → Updates status to "Recording..."
- `eeg_data` → Updates charts and scores
- `error` → Shows error message if connection fails

## What Happens When It Works

✅ **Success Flow:**
1. Button click → WebSocket message sent
2. Backend connects to Ganglion
3. EEG data starts streaming
4. Charts update in real-time
5. Scores (focus, load, anomaly) update every second

## What Happens When It Fails

❌ **Error Scenarios:**

1. **WebSocket Not Connected**
   - Error: "WebSocket not connected. Please refresh the page."
   - Fix: Make sure backend is running

2. **Ganglion Not Found**
   - Error: "Failed to start EEG: Board not found..."
   - Fix: 
     - Make sure Ganglion is powered on
     - Check Bluetooth pairing (System Settings → Bluetooth)
     - Verify MAC address in `.env` file

3. **Permission Denied**
   - Error: "Permission denied" or "Access denied"
   - Fix: Check USB permissions or Bluetooth access

4. **No Connection Parameters**
   - Error: "Failed to connect..."
   - Fix: Set `GANGLION_MAC_ADDRESS` or `GANGLION_SERIAL_PORT` in `.env`

## Debugging

### Check Backend Logs
When you click "Start Recording", you should see in the backend terminal:
```
Starting EEG recording...
Connection parameters - MAC: XX:XX:XX:XX:XX:XX, Serial: None
Connecting to Ganglion via Bluetooth: XX:XX:XX:XX:XX:XX
Starting EEG stream...
EEG recording started successfully!
```

### Check Browser Console
Open browser DevTools (F12) and look for:
```
WebSocket connected
Sending start_recording message...
Received message: {type: "recording_started"}
Received message: {type: "eeg_data", data: {...}}
```

### Check Status Indicator
The status indicator shows:
- **Connected** - WebSocket connected, ready to record
- **Connecting to Ganglion...** - Attempting to connect
- **Recording...** - Successfully streaming EEG data
- **Error** - Connection failed (check error message)

## Configuration

To connect your Ganglion, create a `.env` file in the project root:

```bash
# For Bluetooth (recommended)
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29

# OR for USB
# GANGLION_SERIAL_PORT=/dev/tty.usbserial-XXXXX
```

Find your Ganglion MAC address:
```bash
python find_ganglion.py
```

Or check System Settings → Bluetooth → Ganglion → Info

## Summary

The "Start Recording" button:
1. ✅ Sends a WebSocket message to the backend
2. ✅ Backend connects to your Ganglion board
3. ✅ Starts streaming EEG data
4. ✅ Updates the dashboard in real-time

If nothing happens, check:
- Backend is running (`./start_backend.sh`)
- Ganglion is powered on and paired
- `.env` file has correct connection details
- Browser console for error messages

