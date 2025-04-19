## Frontend Overview
The frontend is built with React and Typescript.

## Installation and Usage

### Local Development
First do:

```bash
npm install
```

To run in dev mode locally

```bash
npm start
```

The app will run at http://localhost:3000

Make sure that the backend is running at http://localhost:8000 . If it isn't, modify BASE_URL in the .env file as appropriate

###  Docker
Run these commands within the checklist-frontend folder:

```bash
docker build -t checklist-frontend .
docker run -p 3000:3000 checklist-frontend
```

## Technologies
- React
- Typescript
- Axios
- Bootstrap 5
- React Router