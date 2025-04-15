from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app import schemas, crud, database

router = APIRouter(prefix="/checklists", tags=["Checklists"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ChecklistOut)
def create_checklist(checklist: schemas.ChecklistCreate, db: Session = Depends(get_db)):
    return crud.create_checklist(db, checklist)

@router.get("/{checklist_id}", response_model=schemas.ChecklistOut)
def read_checklist(checklist_id: int, db: Session = Depends(get_db)):
    checklist = crud.get_checklist(db, checklist_id)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    return checklist

@router.post("/{checklist_id}/categories", response_model=schemas.CategoryOut)
def add_category(checklist_id:int, category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    checklist = crud.get_checklist(db, checklist_id)
    if checklist:
        return crud.create_category(db, category, checklist_id)
    raise HTTPException(status_code=404, detail="Checklist not found")

@router.post("/{checklist_id}/categories/{category_id}/items", response_model=schemas.ItemOut)
def add_item(checklist_id: int, category_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)):
    checklist = crud.get_checklist(db, checklist_id)
    category = crud.get_category(db, category_id)

    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    elif not category:
        raise HTTPException(status_code=404, detail="Category not found")
    else:
        return crud.create_item(db, item, category_id)
    
@router.post("/{checklist_id}/categories/{category_id}/items/{item_id}/upload", response_model=schemas.FileOut)
async def upload_item_file(item_id: int, checklist_id: int, category_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    checklist = crud.get_checklist(db, checklist_id)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    category = crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    mock_url = f"/static/uploads/{file.filename}"
    return crud.create_file_url(db, mock_url, item_id=item_id)

@router.post("/{checklist_id}/categories/{category_id}/upload", response_model=schemas.FileOut)
async def upload_category_file(category_id: int, checklist_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    checklist = crud.get_checklist(db, checklist_id)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    category = crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    mock_url = f"/static/uploads/{file.filename}"
    return crud.create_file_url(db, mock_url, category_id=category_id)