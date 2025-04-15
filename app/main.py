from fastapi import FastAPI
from app import models, database
from app.routers import checklists

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.include_router(checklists.router)
