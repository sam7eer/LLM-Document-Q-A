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
You don't need to do anything complicated to download the code.
1. Scroll to the top of this GitHub page.
2. Click the green **"<> Code"** button.
3. Click **"Download ZIP"**.
4. Once it downloads, find the ZIP file on your computer, Right-Click it, and select **"Extract All..."**.
5. Open the extracted folder until you see files named `README.md`, `start.bat`, and folders like `frontend` and `backend`.

### Step 3: Open the Terminal (Command Prompt)
1. Inside the extracted project folder, look at the very top of the File Explorer window (the address bar where it shows the path, like `C:\Downloads\LLM-Document-Q-A`).
2. Click directly on that address bar so the text highlights.
3. Type `cmd` and press **Enter**.
4. A black box (Command Prompt) will appear. You will be typing commands into this black box.

### Step 4: Set Up the Project (One-Time Only)
Copy and paste each of the following lines into the black Terminal box, one at a time, and press **Enter** after each one. Let the process finish before doing the next one.

1. Create a safe space for Python (Virtual Environment):
   ```cmd
   python -m venv venv
   ```

2. Turn on the Virtual Environment:
   ```cmd
   venv\Scripts\activate
   ```
   *(You should now see `(venv)` at the beginning of the text line.)*

3. Install the Python requirements:
   ```cmd
   pip install -r backend\requirements.txt
   ```

4. Go into the frontend folder:
   ```cmd
   cd frontend
   ```

5. Install the Node modules:
   ```cmd
   npm install
   ```

6. Go back to the main folder:
   ```cmd
   cd ..
   ```

> **🚨 TROUBLESHOOTING (If Step 1 fails):**
> Sometimes on Windows, step 1 (`python -m venv venv`) will throw a red error that mentions `ensurepip`. If this happens, your Windows Python is just being stubborn. Don't panic! **You can completely skip Step 1 and Step 2.** Just start at Step 3 (`pip install...`) and the app will still work perfectly.

### Step 5: Configure the AI (Environment Variables)
1. Go into the `backend` folder.
2. You will see a file named `.env.example`.
3. Make a copy of this file and rename the copy to exactly `.env` (just `.env`, remove the `.example` part).
   *(If you get a warning about changing file extensions, say Yes).*
4. Open the new `.env` file with a text editor (like Notepad). You can Right-Click -> "Open with" -> "Notepad".
5. Find the line that says `GOOGLE_API_KEY=your_google_api_key_here`.
6. Replace `your_google_api_key_here` with the exact Google API Key you got in Step 1.
7. Save and close the file.

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
