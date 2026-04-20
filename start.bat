@echo off
echo Starting DocuMind Q^&A System...

echo Starting FastAPI Backend...
IF EXIST "venv\Scripts\activate.bat" (
    start cmd /k "venv\Scripts\activate && python -m uvicorn backend.main:app --port 8000"
) ELSE (
    start cmd /k "python -m uvicorn backend.main:app --port 8000"
)
echo Starting Vite Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting...
echo Backend API available at: http://localhost:8000
echo Frontend UI available at: http://localhost:5173
echo.
echo Use Ctrl+C in their respective windows to stop them.
