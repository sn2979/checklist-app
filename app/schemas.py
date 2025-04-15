from pydantic import BaseModel
from typing import List, Optional

class ChecklistCreate(BaseModel):
    name: str

class CategoryCreate(BaseModel):
    name: str

class ItemCreate(BaseModel):
    name: str

class FileOut(BaseModel):
    id: int
    file_url: str

    class Config:
        orm_mode = True

class ItemOut(BaseModel):
    id: int
    name: str
    files: List[FileOut] = []
    
    class Config:
        orm_mode = True

class CategoryOut(BaseModel):
    id: int
    name: str
    items: List[ItemOut] = []
    files: List[FileOut] = []

    class Config:
        orm_mode = True

class ChecklistOut(BaseModel):
    id: int
    name: str
    categories: List[CategoryOut] = []

    class Config:
        orm_mode = True