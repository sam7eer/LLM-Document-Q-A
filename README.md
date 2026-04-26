# DocuMind - LLM-Based Q&A System

A full-stack application built to answer questions from your uploaded documents using local embeddings and Google Gemini API.

---

## 🛠️ Complete Beginner's Guide to Running This Project

If you have never touched code before, don't worry! This guide will walk you through every single step to get this project running on your computer.

### Step 1: Install Required Software
Before you start, you need to install two programs that make the code run.
1. **Python (3.11 or newer)**: [Download here](https://www.python.org/downloads/).
   - ⚠️ **CRITICAL STEP**: When you open the Python installer, look at the very bottom of the first screen. You **MUST** check the box that says **"Add Python to PATH"** before clicking "Install". If you miss this, the project will not work!
2. **Node.js**: [Download here](https://nodejs.org/). (Download the "LTS" version. You can just click "Next" on everything during installation).
3. **Get a Google Gemini API Key**: [Get it here](https://aistudio.google.com/). Click "Get API Key" and create one. Save this text somewhere—you will need it later.

### Step 2: Download the Project
You can either download the ZIP file or use Git to clone it (recommended).

**Option A: Using Git (Easiest for updates)**
1. Open your terminal or command prompt.
2. Type the following and press Enter:
   ```bash
   git clone https://github.com/sam7eer/LLM-Document-Q-A.git
   ```
3. Enter the folder:
   ```bash
   cd LLM-Document-Q-A
   ```

**Option B: Manual Download**
1. Click the green **"<> Code"** button at the top of this page.
2. Click **"Download ZIP"**.
3. Extract the ZIP file and open the folder until you see `README.md`.

### Step 3: Open the Terminal
*   **Windows**: Type `cmd` in the address bar of the folder and press Enter.
*   **Mac/Linux**: Right-click in the folder and select "Open in Terminal".

### Step 4: Set Up the Project (One-Time Only)
Run these commands one by one. This sets up your Python environment and installs the frontend tools.

**1. Create and Activate Virtual Environment**
*   **Windows:**
    ```cmd
    python -m venv venv
    venv\Scripts\activate
    ```
*   **Mac/Linux:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
*(You should now see `(venv)` at the start of your command line.)*

**2. Install Backend Dependencies**
```bash
pip install -r backend/requirements.txt
```

**3. Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

> **🚨 TROUBLESHOOTING (If venv fails):**
> Sometimes on Windows, the command `python -m venv venv` throws an error. If this happens, don't panic! **You can skip Step 4.1 entirely.** Just go straight to Step 4.2 (`pip install...`) and the app will still work.

### Step 5: Configure the AI (Environment Variables)
1. Go into the `backend` folder.
2. You will see a file named `.env.example`.
3. Make a copy of this file and rename the copy to exactly `.env`.
4. Open the new `.env` file with a text editor (like Notepad).
5. Replace `your_google_api_key_here` with your actual Google API Key.
6. Save and close the file.

---

## 🚀 Running the App

You only have to do the setup once. From now on, whenever you want to use the app, just do this:

1. Go to the project folder.
2. Double-click the `start.bat` file.
3. Two command prompt windows will open. Leave them open—they are running the app!
4. The app will automatically launch your web browser and open the interface at `http://localhost:5173`.

*To close the app when you are done, simply go to those black command prompt windows and close them (click the X).*

### Alternatively: Running Manually (If start.bat doesn't work)
If double-clicking the `start.bat` file doesn't work for you, you can run the app manually. You will need to open **two** separate command prompt windows in the project folder.

**Window 1: Start the Backend (Commands)**
```cmd
python -m uvicorn backend.main:app --port 8000
```
*(If the above fails and you are using a virtual environment, run `venv\Scripts\activate` first)*

**Window 2: Start the Frontend (Commands)**
```cmd
cd frontend
npm run dev
```

> **🚨 TROUBLESHOOTING (If npm gives a red "running scripts is disabled" error):**
> This means you opened PowerShell instead of Command Prompt. Don't worry! Just type `cmd` and press Enter to switch to the normal Command Prompt, and then type `npm run dev` again. Alternatively, you can type **`npm.cmd run dev`** instead!

Once both are running, open your browser and go to `http://localhost:5173`.
