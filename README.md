# Checklist Builder

## Overview
A full stack application that allows users to create and manage checklists for various tasks/projects. Under each checklist, users can add categories and under categories, users can add items. Users can then upload files to both categories and items and can also rename/delete/add categories, items, and checklists. Checklists can be shared via a public link with others that allows additional collaborators to upload files to the checklist as well. In addition, users can make copies of checklists ("clone checklists").

## Author
Samyukta Neeraj

## Installation and Usage
Make sure that Docker and Docker Compose are installed. Once they are, run:
```bash
docker compose up --build
```

The app will be available at:
Frontend: http://localhost:3000 and Backend: http://localhost:8000


## Technologies
Backend: FastAPI, SQLAlchemy, SQLite
Frontend: React, Typescript, Bootstrap
Containerization: Docker, Docker Compose


