# DocuMind - LLM-Based Q&A System

A full-stack RAG (Retrieval-Augmented Generation) application built to answer questions from your uploaded documents using local embeddings and Google Gemini API.

---

## 🛠️ Step-by-Step Setup Guide (For Beginners)

If you don't know how to code, don't worry! Follow these steps exactly to get the project running on your computer.

### Step 1: Install Required Software
Before you start, make sure you have the following installed on your computer:
1. **Python (3.11 or newer)**: [Download here](https://www.python.org/downloads/).
   - **IMPORTANT**: During installation, make sure to check the box that says **"Add Python to PATH"**.
2. **Node.js**: [Download here](https://nodejs.org/). (Download the "LTS" version).
3. **Get a Google Gemini API Key**: [Get it here](https://aistudio.google.com/). You will need this to make the AI work.

### Step 2: Set Up the Project
1. Open up a terminal (Command Prompt) inside this project folder.
   - *Tip*: You can go to the project folder in File Explorer, click the address bar at the top, type `cmd`, and press Enter.

2. Create a "Virtual Environment" (a safe space for Python files):
   Type the following command and press Enter:
   ```cmd
   python -m venv venv
   ```

3. Activate the Virtual Environment:
   Type the following command and press Enter:
   ```cmd
   venv\Scripts\activate
   ```

4. Install the Python requirements for the Backend:
   Type the following command and press Enter:
   ```cmd
   pip install -r backend\requirements.txt
   ```

5. Install the Node modules for the Frontend:
   Type the following commands one by one, pressing Enter after each:
   ```cmd
   cd frontend
   npm install
   cd ..
   ```

### Step 3: Configure the AI (Environment Variables)
1. Go into the `backend` folder.
2. You will see a file named `.env.example`. Make a copy of this file and rename the copy to `.env` (just `.env`, nothing else).
3. Open the new `.env` file with a text editor (like Notepad).
4. Replace `your_google_api_key_here` with the exact Google API Key you got in Step 1. Save and close the file.

---

## 🚀 Running the App

Once you have finished the setup above, you never need to repeat it.

To start the app:
1. Simply double-click the `start.bat` file located in the main folder.
2. Two command prompt windows will open automatically. Please leave them open!
3. The app will launch your web browser and open the interface at `http://localhost:5173`.

*If you want to close the app, go to the command prompt windows and press `Ctrl + C`, or simply close the windows.*
