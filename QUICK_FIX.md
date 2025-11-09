# Quick Fix: Your BLE Dongle is Detected!

## ✅ Found Your Dongle!

Your BLE dongle is at: **`/dev/cu.usbmodem11`**

## Quick Setup

Create a `.env` file in the project root (`/Users/garr/Desktop/Neurocalm/.env`):

```bash
GANGLION_DONGLE_PORT=/dev/cu.usbmodem11
```

**Note:** Use `/dev/cu.*` ports for OpenBCI on macOS (not `/dev/tty.*`)

## Then Try Again

1. **Make sure:**
   - ✅ BLE dongle is plugged in
   - ✅ Ganglion is powered on (LED blinking)
   - ✅ Ganglion is in range

2. **Restart backend:**
   ```bash
   # Stop backend (Ctrl+C)
   ./start_backend.sh
   ```

3. **Click "Start Recording"** on the Dashboard

The system will auto-detect the Ganglion MAC address!

## Why It Works Now

- ✅ Fixed to use `/dev/cu.*` ports (correct for OpenBCI on macOS)
- ✅ Auto-detection will scan for Ganglion MAC address
- ✅ No need to find MAC address manually

## If It Still Doesn't Work

Run the auto-detection script:
```bash
source venv/bin/activate
python -m backend.auto_detect_ganglion
```

This will test the connection and tell you if it works!

