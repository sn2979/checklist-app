## Backend Overview
The frontend is built with Python and FastAPI.

## Installation and Usage

### Local Development
First create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

To start the server run:
```bash
uvicorn main:app --reload

The API will run at http://localhost:8000

###  Docker
Run these commands within the checklist-backend folder:
```bash
docker build -t checklist-backend .
docker run -p 8000:8000 checklist-backend

## Technologies
- FastAPI
- SQLAlchemy
- SQLite 
- Pydantic
- Uvicorn