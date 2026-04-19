@echo off
echo Starting DocuMind Q^&A System...

echo Starting FastAPI Backend...
start cmd /k "venv\Scripts\activate && uvicorn backend.main:app --reload --port 8000"

echo Starting Vite Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting...
echo Backend API available at: http://localhost:8000
echo Frontend UI available at: http://localhost:5173
echo.
echo Use Ctrl+C in their respective windows to stop them.
