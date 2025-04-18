# checklist-backend/Dockerfile

FROM python:3.11

WORKDIR /app

# Copy requirements from root context into the container
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code from checklist-backend folder
COPY checklist-backend/ .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
