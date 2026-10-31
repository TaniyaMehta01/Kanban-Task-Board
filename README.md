# Flowboard — Kanban Task Board

A responsive Kanban task manager built with React, Vite and CSS.

## Features
- Three workflow columns: To Do, In Progress and Done
- Create, edit and delete tasks
- Set task priority (High, Medium, Low)
- Optional task description and due date
- Move tasks between columns with arrow controls
- Drag and drop cards between columns
- Search tasks instantly
- Automatically saves tasks in browser LocalStorage
- Responsive layout for mobile and desktop
- Progress indicator

## Requirements
- Node.js 18+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this project folder to a GitHub repository.
2. Import that repository in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

## Project structure
```
kanban-board/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    └── style.css
```

## Notes
- No API key or backend is required.
- Data is stored in the browser where the app is running. It does not sync across devices.
- Drag cards with a mouse or touchpad; arrow buttons are also available to move tasks.
