#!/usr/bin/env python3
"""
Helper script to find OpenBCI Ganglion connection details
"""
import sys
import subprocess
import platform

def find_bluetooth_devices():
    """Find Bluetooth devices on macOS"""
    if platform.system() != "Darwin":
        print("Bluetooth detection currently only works on macOS")
        return []
    
    try:
        # Use system_profiler to find Bluetooth devices
        result = subprocess.run(
            ["system_profiler", "SPBluetoothDataType"],
            capture_output=True,
            text=True
        )
        
        devices = []
        lines = result.stdout.split('\n')
        for i, line in enumerate(lines):
            if "Ganglion" in line or "OpenBCI" in line:
                # Look for MAC address in nearby lines
                for j in range(max(0, i-5), min(len(lines), i+10)):
                    if "Address:" in lines[j] or "MAC Address:" in lines[j]:
                        mac = lines[j].split(":")[-1].strip()
                        if mac and len(mac) > 10:
                            devices.append(mac)
                            break
        
        return devices
    except Exception as e:
        print(f"Error finding Bluetooth devices: {e}")
        return []

def find_usb_ports():
    """Find USB serial ports"""
    import glob
    
    patterns = [
        "/dev/tty.usbserial-*",
        "/dev/tty.usbmodem-*",
        "/dev/tty.USB*",
        "/dev/ttyUSB*",
        "/dev/ttyACM*",
    ]
    
    ports = []
    for pattern in patterns:
        ports.extend(glob.glob(pattern))
    
    return ports

def main():
    print("=" * 60)
    print("OpenBCI Ganglion Connection Finder")
    print("=" * 60)
    print()
    
    # Check Bluetooth
    print("Checking Bluetooth devices...")
    bt_devices = find_bluetooth_devices()
    if bt_devices:
        print(f"Found {len(bt_devices)} potential Ganglion device(s):")
        for mac in bt_devices:
            print(f"  MAC Address: {mac}")
        print()
        print("To use Bluetooth, set in .env file:")
        print(f"GANGLION_MAC_ADDRESS={bt_devices[0]}")
    else:
        print("No Ganglion Bluetooth devices found.")
        print("Make sure:")
        print("  1. Ganglion is powered on")
        print("  2. Ganglion is paired in System Settings → Bluetooth")
    print()
    
    # Check USB ports
    print("Checking USB serial ports...")
    usb_ports = find_usb_ports()
    if usb_ports:
        print(f"Found {len(usb_ports)} USB serial port(s):")
        for port in usb_ports:
            print(f"  {port}")
        print()
        print("To use USB, set in .env file:")
        print(f"GANGLION_SERIAL_PORT={usb_ports[0]}")
    else:
        print("No USB serial ports found.")
        print("Make sure USB dongle is connected if using USB connection.")
    print()
    
    # Instructions
    print("=" * 60)
    print("Next Steps:")
    print("=" * 60)
    print("1. Create a .env file in the project root")
    print("2. Add one of the following:")
    print("   - GANGLION_MAC_ADDRESS=XX:XX:XX:XX:XX:XX (for Bluetooth)")
    print("   - GANGLION_SERIAL_PORT=/dev/tty.XXXXX (for USB)")
    print("3. Start the backend and frontend")
    print("4. Click 'Start Recording' on the Dashboard")
    print()

if __name__ == "__main__":
    main()

