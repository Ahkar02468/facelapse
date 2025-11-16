
# faceLAPSE

Life moves fast, and the small, everyday changes are impossible to see until you look back.
faceLAPSE is a simple, dedicated, and fun app built for one purpose: to help you create a beautiful time-lapse video of your own life.

![facelapse Portfolio](./frontend/public/facelapse-ss.png "facelapse")
![facelapse Portfolio](./frontend/public/facelapse-ss1.png "facelapse")

## Getting Started

This project contains a frontend built with Astro and a Python backend powered by Flask.

### Prerequisites

- Node.js and pnpm
- Python 3.13+ and pip
- A virtual environment tool (like `venv`)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Ahkar02468/facelapse.git
   cd facelapse
   ```

2. **Set up the Backend:**

   - Create and activate a Python virtual environment from the root of the project.
     ```sh
     python3 -m venv facelapse
     source facelapse/bin/activate
     ```
   - Install the required Python packages:
     ```sh
     pip install -r backend/requirements.txt
     ```

3. **Set up the Frontend:**

   - Install the Node.js dependencies using pnpm from within the `frontend` directory:
     ```sh
     cd frontend
     pnpm install
     ```

## Running the Application

You need to run both the backend and frontend servers in separate terminals.

1. **Run the Backend (Flask):**

   - Make sure your virtual environment is activated.
   - Start the Flask server from the root of the project:
     ```sh
     python3 backend/app.py
     ```
   - The backend will be running on `http://127.0.0.1:5000/`

2. **Run the Frontend (Astro):**

   - Navigate to the `frontend` directory and start the development server:
     ```sh
     cd frontend
     pnpm run dev
     ```
   - The frontend will be running on `http://localhost:4321`.

## Project Structure

```text
/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   ├── astro.config.mjs
│   └── package.json
└── README.md
```

## License

This project is licensed under the MIT License - see the `frontend/LICENSE` file for details.
