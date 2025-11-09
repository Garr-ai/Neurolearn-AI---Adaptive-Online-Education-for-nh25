# Setting Up Ganglion with BLE Dongle (BLED112)

## Using a BLE Dongle Changes the Setup!

When using a **BLE dongle (BLED112)**, you need **both**:
1. The **Ganglion's MAC address** (the board itself)
2. The **dongle's serial port** (the USB dongle)

## Step 1: Find Your Connection Details

### Find the Ganglion MAC Address

1. **Power on your Ganglion** (LED should be blinking)
2. **Pair Ganglion** (even though you're using a dongle):
   - System Settings → Bluetooth
   - Look for "Ganglion" or "OpenBCI"
   - Click "Connect" or "Pair"
3. **Get MAC address:**
   - System Settings → Bluetooth → Ganglion → Info
   - Copy the MAC address (format: `XX:XX:XX:XX:XX:XX`)

### Find the BLE Dongle Serial Port

1. **Plug in your BLE dongle** (BLED112) to USB
2. **Find the serial port:**
   ```bash
   ls /dev/tty.usbserial-* /dev/tty.usbmodem-* /dev/tty.USB* 2>/dev/null
   ```
   
   Common names on macOS:
   - `/dev/tty.usbserial-XXXXX`
   - `/dev/tty.usbmodem-XXXXX`
   - `/dev/tty.USB-Serial-XXXXX`

3. **Or run the helper script:**
   ```bash
   source venv/bin/activate
   python find_ganglion.py
   ```

## Step 2: Create .env File

Create a `.env` file in the project root (`/Users/garr/Desktop/Neurocalm/.env`):

```bash
# BLE Dongle Setup (REQUIRE BOTH!)
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29
GANGLION_DONGLE_PORT=/dev/tty.usbserial-XXXXX
```

**Replace:**
- `00:A0:C9:14:C8:29` with your Ganglion's MAC address
- `/dev/tty.usbserial-XXXXX` with your dongle's serial port

## Step 3: Restart Backend

After creating the `.env` file:

```bash
# Stop backend (Ctrl+C)
# Restart:
./start_backend.sh
```

## Step 4: Test Connection

1. **Make sure:**
   - ✅ BLE dongle is plugged in
   - ✅ Ganglion is powered on
   - ✅ Ganglion is paired (System Settings → Bluetooth)

2. **Go to Dashboard** at http://localhost:3000
3. **Click "Start Recording"**
4. You should see "Recording..." status
5. EEG data should start appearing

## Troubleshooting

### "you need to specify dongle port" Error

This means you're missing the dongle port in your `.env` file.

**Fix:**
1. Find your dongle's serial port: `ls /dev/tty.usb*`
2. Add `GANGLION_DONGLE_PORT=/dev/tty.usbserial-XXXXX` to `.env`
3. Restart backend

### "Failed to start EEG" Error

**Check:**
1. ✅ BLE dongle is plugged in
2. ✅ Ganglion is powered on
3. ✅ Ganglion is paired (System Settings → Bluetooth)
4. ✅ `.env` file has BOTH `GANGLION_MAC_ADDRESS` AND `GANGLION_DONGLE_PORT`
5. ✅ MAC address format is correct: `XX:XX:XX:XX:XX:XX` (uppercase, colons)

### Can't Find Dongle Serial Port

1. **Make sure dongle is plugged in:**
   ```bash
   ls /dev/tty.usb* /dev/tty.usbserial* 2>/dev/null
   ```

2. **Check System Information:**
   - Apple menu → About This Mac → System Report
   - USB → Look for "BLED112" or similar

3. **Try different USB port**

4. **Check if dongle is recognized:**
   ```bash
   system_profiler SPUSBDataType | grep -i "ble\|dongle\|serial"
   ```

## Example .env File for BLE Dongle

```bash
# BLE Dongle Configuration
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29
GANGLION_DONGLE_PORT=/dev/tty.usbserial-DN00XXXX
```

## Difference: Direct Bluetooth vs BLE Dongle

### Direct Bluetooth (Built-in Bluetooth)
```bash
# Only need MAC address
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29
```

### BLE Dongle (BLED112)
```bash
# Need BOTH MAC address AND dongle port
GANGLION_MAC_ADDRESS=00:A0:C9:14:C8:29
GANGLION_DONGLE_PORT=/dev/tty.usbserial-XXXXX
```

## Summary

**For BLE dongle, you need:**
- ✅ Ganglion MAC address (from the board)
- ✅ Dongle serial port (from the USB dongle)
- ✅ Both set in `.env` file

The dongle acts as a bridge between your computer and the Ganglion board!

