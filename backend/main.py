"""
Main entry point for backend services
Starts both the FastAPI server and WebSocket server
"""
import asyncio
import uvicorn
from multiprocessing import Process
from backend.api import app
from backend.websocket_server import WebSocketServer

def run_api():
    """Run FastAPI server"""
    uvicorn.run(app, host="0.0.0.0", port=8000)

def run_websocket():
    """Run WebSocket server"""
    server = WebSocketServer()
    asyncio.run(server.start())

if __name__ == "__main__":
    # Start API server in a separate process
    api_process = Process(target=run_api)
    api_process.start()
    
    # Start WebSocket server in main process
    try:
        run_websocket()
    except KeyboardInterrupt:
        print("Shutting down...")
        api_process.terminate()
        api_process.join()



