# OpenBCI Ganglion Setup Guide

## Quick Setup

Your Ganglion board is now configured to work with NeuroCalm! Here's how to connect it:

## Connection Methods

The OpenBCI Ganglion can connect via:
1. **Bluetooth** (recommended) - Wireless connection
2. **USB** - Wired connection via USB dongle

## Step 1: Find Your Ganglion Connection Details

### For Bluetooth Connection (Recommended)

1. **Pair your Ganglion with your Mac:**
   - Turn on your Ganglion board
   - On macOS: System Settings → Bluetooth
   - Look for "Ganglion" or "OpenBCI" device
   - Click "Connect" or "Pair"
   - Note the MAC address (format: `XX:XX:XX:XX:XX:XX`)

2. **Find the MAC address:**
   ```bash
   # On macOS, you can check paired devices:
   system_profiler SPBluetoothDataType | grep -A 5 "Ganglion\|OpenBCI"
   ```

### For USB Connection

1. **Connect the Ganglion via USB dongle**
2. **Find the serial port:**
   ```bash
   # On macOS:
   ls /dev/tty.usbserial-* /dev/tty.usbmodem-* /dev/tty.USB*
   
   # Common names:
   # /dev/tty.usbserial-XXXXX
   # /dev/tty.usbmodem-XXXXX
   ```

## Step 2: Configure Connection

### Option A: Using Environment Variables (Recommended)

Create a `.env` file in the project root:

```bash
# For Bluetooth connection
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29  # Replace with your Ganglion's MAC address

# OR for USB connection
GANGLION_SERIAL_PORT=/dev/tty.usbserial-XXXXX  # Replace with your port
```

### Option B: Connect via Web Interface

1. Start the backend and frontend
2. Go to the Dashboard
3. Click "Start Recording"
4. If needed, the system will prompt for connection details

## Step 3: Start the Application

1. **Start Backend:**
   ```bash
   source venv/bin/activate
   ./start_backend.sh
   ```

2. **Start Frontend (new terminal):**
   ```bash
   cd frontend
   npm start
   ```

3. **Connect Ganglion:**
   - Make sure Ganglion is powered on
   - If using Bluetooth, ensure it's paired
   - Go to Dashboard and click "Start Recording"

## Troubleshooting

### "Failed to start EEG" Error

1. **Check Ganglion is powered on:**
   - LED should be blinking/on

2. **Check Bluetooth pairing:**
   - macOS: System Settings → Bluetooth
   - Make sure Ganglion shows as "Connected"

3. **Check MAC address format:**
   - Should be: `XX:XX:XX:XX:XX:XX` (uppercase, colons)
   - Example: `00:A0:C9:14:C8:29`

4. **Try USB connection instead:**
   - Connect USB dongle
   - Find port: `ls /dev/tty.usb*`
   - Set `GANGLION_SERIAL_PORT` in `.env`

### "Board not found" Error

- Make sure Ganglion is turned on
- Try unplugging and replugging USB dongle (if using USB)
- Try unpairing and re-pairing Bluetooth connection
- Restart the backend service

### No Data Appearing

- Wait a few seconds after starting recording (needs to collect samples)
- Check that electrodes are properly connected
- Verify Ganglion LED is blinking (indicates active streaming)

### Permission Denied (USB)

If you get permission errors with USB:
```bash
# Add your user to dialout group (Linux)
sudo usermod -a -G dialout $USER

# On macOS, you may need to grant terminal permissions
# System Settings → Privacy & Security → Full Disk Access
```

## Testing Connection

You can test the connection before starting the full app:

```python
from backend.eeg_service import EEGService
from brainflow.board_shim import BoardIds

# Test connection
eeg = EEGService(board_id=BoardIds.GANGLION_BOARD)
try:
    # For Bluetooth:
    eeg.connect(mac_address="00:A0:C9:14:C8:29")  # Replace with your MAC
    
    # OR for USB:
    # eeg.connect(serial_port="/dev/tty.usbserial-XXXXX")
    
    print("Connected successfully!")
    eeg.disconnect()
except Exception as e:
    print(f"Connection failed: {e}")
```

## Default Configuration

The system is now configured to use `GANGLION_BOARD` by default. If you want to switch back to synthetic board for testing:

```bash
export BOARD_ID=0  # 0 = SYNTHETIC_BOARD
```

Or in code:
```python
from brainflow.board_shim import BoardIds
eeg = EEGService(board_id=BoardIds.SYNTHETIC_BOARD)
```

## Next Steps

1. **Calibrate**: Go to Calibrate page to establish baseline
2. **Start Recording**: Click "Start Recording" on Dashboard
3. **Monitor**: Watch real-time EEG data stream
4. **Switch Modes**: Use tabs to track different activities

## Ganglion Specifications

- **Channels**: 4 EEG channels
- **Sampling Rate**: 200 Hz
- **Connection**: Bluetooth or USB
- **Battery**: Built-in rechargeable

For more information, visit: https://openbci.com/

