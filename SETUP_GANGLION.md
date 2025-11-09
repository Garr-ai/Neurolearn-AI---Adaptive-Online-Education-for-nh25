# Setting Up Your Ganglion Connection

## Quick Fix for "you need to specify dongle port" Error

The Ganglion board **cannot auto-detect** - you must provide connection details.

## Step 1: Find Your Ganglion Connection Details

Run the helper script:
```bash
source venv/bin/activate
python find_ganglion.py
```

This will show you:
- Bluetooth MAC address (if paired)
- USB serial ports (if connected)

## Step 2: Create .env File

Create a `.env` file in the project root (`/Users/garr/Desktop/Neurocalm/.env`):

### Option A: Bluetooth Connection (Recommended)

```bash
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29
```

Replace `00:A0:C9:14:C8:29` with your actual Ganglion MAC address.

**To find your MAC address:**
1. Make sure Ganglion is powered on
2. Pair it in System Settings → Bluetooth
3. Click on the Ganglion device → Info
4. Copy the MAC address (format: `XX:XX:XX:XX:XX:XX`)

### Option B: USB Connection

```bash
GANGLION_SERIAL_PORT=/dev/tty.usbserial-XXXXX
```

Replace `/dev/tty.usbserial-XXXXX` with your actual serial port.

**To find your serial port:**
```bash
ls /dev/tty.usb* /dev/tty.usbserial* 2>/dev/null
```

## Step 3: Restart Backend

After creating the `.env` file:

```bash
# Stop backend (Ctrl+C)
# Restart:
./start_backend.sh
```

## Step 4: Test Connection

1. Go to Dashboard at http://localhost:3000
2. Click "Start Recording"
3. You should see "Recording..." status
4. EEG data should start appearing in the charts

## Troubleshooting

### "you need to specify dongle port" Error

This means the `.env` file is missing or incorrect.

**Fix:**
1. Create `.env` file in project root
2. Add either `GANGLION_MAC_ADDRESS` or `GANGLION_SERIAL_PORT`
3. Restart backend

### "Failed to start EEG" Error

**Check:**
1. ✅ Ganglion is powered on (LED should be on/blinking)
2. ✅ Ganglion is paired (System Settings → Bluetooth)
3. ✅ `.env` file exists and has correct values
4. ✅ MAC address format is correct: `XX:XX:XX:XX:XX:XX` (uppercase, colons)

### Can't Find MAC Address

1. **Pair Ganglion first:**
   - System Settings → Bluetooth
   - Turn on Ganglion
   - Look for "Ganglion" or "OpenBCI"
   - Click "Connect" or "Pair"

2. **Then find MAC:**
   ```bash
   system_profiler SPBluetoothDataType | grep -A 5 "Ganglion\|OpenBCI"
   ```

3. **Or check System Settings:**
   - System Settings → Bluetooth → Ganglion → Info
   - MAC address should be listed there

## Example .env File

```bash
# Ganglion Connection (choose one)
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29
# OR
# GANGLION_SERIAL_PORT=/dev/tty.usbserial-XXXXX
```

## Summary

**The error "you need to specify dongle port" means:**
- ❌ No connection parameters provided
- ✅ Solution: Create `.env` file with `GANGLION_MAC_ADDRESS` or `GANGLION_SERIAL_PORT`

Once you set this up, the "Start Recording" button will work!

