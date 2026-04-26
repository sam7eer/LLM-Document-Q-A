#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p)
    exit
}

trap cleanup EXIT

echo "Starting DocuMind Q&A System..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Start Backend
echo "Starting FastAPI Backend on http://localhost:8000..."
python3 -m uvicorn backend.main:app --port 8000 &

# Start Frontend
echo "Starting Vite Frontend on http://localhost:5173..."
cd frontend
# Check if node_modules exists, if not, tell the user
if [ ! -d "node_modules" ]; then
    echo "Error: node_modules not found in frontend directory."
    echo "Please run 'cd frontend && npm install' first."
    exit 1
fi
npm run dev &

# Go back to root
cd ..

# Wait for processes
wait
