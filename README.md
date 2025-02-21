# Remote Config Dashboard

A full-stack application for managing remote configuration values with real-time updates.

Frontend: vite, react, chakra.ui, zod, zustand
Backend: express,node
Database: MongoDB

## Setup

1. **Prerequisites**: Docker and Docker Compose installed.
2. **Run**: `docker-compose up --build`
3. **Access**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api/configs`

## Features

- Create, edit, delete config values with immutability (superseded/deleted flags).
- Real-time updates via WebSocket.
- Sorting by name, description, type, and last updated.
- Duplicate and download actions.
- Overlap prevention for conflicting filters.
