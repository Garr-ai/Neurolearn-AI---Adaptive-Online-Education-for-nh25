"""
EEG Service using BrainFlow to read from OpenBCI
"""
from brainflow.board_shim import BoardShim, BrainFlowInputParams, BoardIds
from brainflow.data_filter import DataFilter, FilterTypes, AggOperations
import numpy as np
import asyncio
from typing import Optional, Callable

class EEGService:
    """Service to handle EEG data collection from OpenBCI"""
    
    def __init__(self, board_id: int = BoardIds.SYNTHETIC_BOARD):
        """
        Initialize EEG service
        For OpenBCI, use BoardIds.CYTON_BOARD or BoardIds.GANGLION_BOARD
        For testing, use BoardIds.SYNTHETIC_BOARD
        """
        self.board_id = board_id
        self.board = None
        self.is_streaming = False
        self.data_callback: Optional[Callable] = None
        
    def connect(self, serial_port: Optional[str] = None, mac_address: Optional[str] = None, dongle_port: Optional[str] = None):
        """Connect to the board
        
        For Ganglion board:
        - Bluetooth (direct): Provide mac_address (e.g., "00:A0:C9:14:C8:29")
        - Bluetooth via BLE dongle: Provide mac_address AND dongle_port
        - USB: Provide serial_port (e.g., "/dev/ttyUSB0" on Linux, "/dev/tty.usbserial-*" on macOS)
        
        For BLE dongle (BLED112):
        - dongle_port: Serial port of the BLE dongle (e.g., "/dev/tty.usbserial-XXXXX")
        - mac_address: MAC address of the Ganglion board itself
        """
        params = BrainFlowInputParams()
        if serial_port:
            params.serial_port = serial_port
        if mac_address:
            params.mac_address = mac_address
        if dongle_port:
            # For BLE dongle, the dongle port is specified as serial_port
            # and the Ganglion MAC is specified as mac_address
            params.serial_port = dongle_port
        
        self.board = BoardShim(self.board_id, params)
        self.board.prepare_session()
        
    def disconnect(self):
        """Disconnect from the board"""
        if self.board:
            self.board.release_session()
            self.board = None
            self.is_streaming = False
    
    def start_streaming(self, callback: Callable):
        """Start streaming EEG data"""
        if not self.board:
            raise RuntimeError("Board not connected. Call connect() first.")
        
        self.data_callback = callback
        self.board.start_stream()
        self.is_streaming = True
    
    def stop_streaming(self):
        """Stop streaming EEG data"""
        if self.board and self.is_streaming:
            self.board.stop_stream()
            self.is_streaming = False
    
    def get_bandpowers(self, window_seconds: int = 1) -> dict:
        """
        Calculate band powers from recent EEG data
        Returns: { alpha, beta, theta, gamma, focus_score, load_score, anomaly_score }
        """
        if not self.board or not self.is_streaming:
            return None
        
        # Get board data
        board_data = self.board.get_board_data()
        if board_data.shape[1] < 100:  # Need enough samples
            return None
        
        # Get EEG channels (adjust based on your board)
        eeg_channels = BoardShim.get_eeg_channels(self.board_id)
        sampling_rate = BoardShim.get_sampling_rate(self.board_id)
        
        if len(eeg_channels) == 0:
            return None
        
        # Use first EEG channel for simplicity
        eeg_data = board_data[eeg_channels[0]]
        
        # Calculate band powers
        alpha = DataFilter.get_band_power(eeg_data, 8.0, 13.0, sampling_rate)
        beta = DataFilter.get_band_power(eeg_data, 13.0, 30.0, sampling_rate)
        theta = DataFilter.get_band_power(eeg_data, 4.0, 8.0, sampling_rate)
        gamma = DataFilter.get_band_power(eeg_data, 30.0, 100.0, sampling_rate)
        
        # Calculate scores (simplified - you'll want to refine these)
        total_power = alpha + beta + theta + gamma
        if total_power == 0:
            return None
        
        # Focus score: higher alpha/theta ratio suggests better focus
        focus_score = (alpha / (theta + 1e-6)) * 50  # Normalize to 0-100
        
        # Load score: higher beta suggests cognitive load
        load_score = (beta / (total_power + 1e-6)) * 100
        
        # Anomaly score: detect unusual patterns (simplified)
        anomaly_score = abs(beta - alpha) / (total_power + 1e-6) * 100
        
        return {
            "alpha": float(alpha),
            "beta": float(beta),
            "theta": float(theta),
            "gamma": float(gamma),
            "focus_score": float(np.clip(focus_score, 0, 100)),
            "load_score": float(np.clip(load_score, 0, 100)),
            "anomaly_score": float(np.clip(anomaly_score, 0, 100))
        }
    
    async def stream_loop(self):
        """Async loop to continuously stream and process EEG data"""
        while self.is_streaming:
            try:
                bandpowers = self.get_bandpowers()
                if bandpowers and self.data_callback:
                    await self.data_callback(bandpowers)
                await asyncio.sleep(1)  # Update every second
            except Exception as e:
                print(f"Error in stream loop: {e}")
                await asyncio.sleep(1)

