# KanbanBoard

MERN-Projekt von Hendrik Ott und Ahmad Yaser Daqiq.

## Beschreibung

KanbanBoard ist eine Webanwendung zur Verwaltung von Projekten und Aufgaben.

Benutzer können mehrere Boards erstellen und darin Aufgaben über die drei Kanban-Status verwalten:

- To Do
- In Progress
- Done

Die Daten werden über eine REST-API im Backend verarbeitet und dauerhaft in MongoDB gespeichert.

## Funktionen

### Boards

- Board erstellen
- Board bearbeiten
- Board löschen
- Beschreibung hinzufügen
- Reihenfolge der Boards ändern
- Speicherung in MongoDB

### Tasks

- Aufgabe erstellen
- Aufgabe bearbeiten
- Aufgabe löschen
- Aufgabe zwischen To Do, In Progress und Done verschieben
- Priorität auswählen:
  - Hoch
  - Medium
  - Niedrig
- Aufgaben nach Priorität filtern
- Fälligkeitsdatum festlegen
- Vergangene Fälligkeitsdaten werden verhindert
- Reihenfolge von Aufgaben ändern
- Änderungen bleiben nach einem Reload gespeichert

## Technologien

### Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- React Router

### Backend

- Node.js
- Express
- Mongoose
- MongoDB
- REST API

### Testing

- Playwright
- Manuelle Funktionstests
- Backend-Validierung

## Projektstruktur

```text
KanbanBoard/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── tests/
│   ├── playwright.config.js
│   └── package.json
│
├── .gitignore
└── README.md