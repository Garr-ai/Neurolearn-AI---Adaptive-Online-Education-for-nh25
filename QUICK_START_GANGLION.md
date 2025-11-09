# Quick Start: Connect Your Ganglion Board

## ✅ Your Ganglion is Now Configured!

The system is now set up to use your OpenBCI Ganglion board instead of the synthetic board.

## Step 1: Find Your Ganglion Connection Details

Run the helper script:
```bash
source venv/bin/activate
python find_ganglion.py
```

This will show you:
- Bluetooth MAC address (if paired)
- USB serial ports (if connected)

## Step 2: Create Connection File (REQUIRED!)

**IMPORTANT:** The Ganglion cannot auto-detect - you MUST create a `.env` file!

Create a `.env` file in the project root (`/Users/garr/Desktop/Neurocalm/.env`):
```bash
# Option 1: Bluetooth connection (recommended)
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29  # Replace with your MAC address

# Option 2: USB connection
# GANGLION_SERIAL_PORT=/dev/tty.usbserial-XXXXX  # Replace with your port
```

## Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
./start_backend.sh
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Step 4: Connect Ganglion

1. **Make sure Ganglion is powered on** (LED should be on/blinking)
2. **If using Bluetooth:**
   - Pair Ganglion in System Settings → Bluetooth
   - Make sure it shows as "Connected"
3. **Go to Dashboard** at http://localhost:3000
4. **Click "Start Recording"**

The system will automatically connect to your Ganglion board!

## Troubleshooting

### "Failed to start EEG" Error

1. **Check Ganglion is on** - LED should be blinking
2. **Check Bluetooth pairing** - System Settings → Bluetooth
3. **Verify MAC address** - Format: `XX:XX:XX:XX:XX:XX` (uppercase, colons)
4. **Try USB instead** - Connect USB dongle and use `GANGLION_SERIAL_PORT`

### No Data Appearing

- Wait 5-10 seconds after starting recording
- Check that electrodes are connected
- Verify Ganglion LED is blinking (active streaming)

### Can't Find MAC Address

1. **Pair Ganglion first:**
   - System Settings → Bluetooth
   - Turn on Ganglion
   - Look for "Ganglion" or "OpenBCI" device
   - Click "Connect"

2. **Then run:**
   ```bash
   system_profiler SPBluetoothDataType | grep -A 5 "Ganglion\|OpenBCI"
   ```

## Manual Connection (If Auto-Detect Fails)

You can also send connection details via the WebSocket:

```javascript
// In browser console or frontend code
websocket.send(JSON.stringify({
  type: "start_recording",
  mac_address: "00:A0:C9:14:C8:29"  // Your Ganglion MAC
}));
```

## That's It!

Your Ganglion board is now ready to stream EEG data to the NeuroCalm dashboard!

For more details, see `GANGLION_SETUP.md`

