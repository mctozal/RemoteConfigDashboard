# Remote Config Dashboard

A full-stack application for managing remote configuration values with real-time updates.

<a href="https://freeimage.host/i/39sYxjI"><img src="https://iili.io/39sYxjI.md.png" alt="39sYxjI.md.png" ></a>

<a href="https://freeimage.host/i/39s8nQ1"><img src="https://iili.io/39s8nQ1.md.png" alt="39s8nQ1.md.png" ></a>

Frontend: vite, react, chakra.ui, zod, zustand
Backend: express,node
Database: MongoDB

## Setup

1. **Prerequisites**: Docker and Docker Compose installed.
2. **Run**: `docker-compose up --build`
3. **Access**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api/configs`

OR

1.  Configure .env mongo db connection
2.  **Run Server**: go to backend folder with terminal and exec 'nodemon src/index.ts'
3.  **Run Frontend**: go to frontend folder with terminal and exec 'npm run dev'

## Features

- Create, edit, delete config values with immutability (superseded/deleted flags).
- Real-time updates via WebSocket.
- Sorting by name, description, type, and last updated.
- Duplicate and download actions.
- Overlap prevention for conflicting filters.
