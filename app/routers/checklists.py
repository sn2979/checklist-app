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

# get routes
@router.get("/{checklist_id}", response_model=schemas.ChecklistOut)
def read_checklist(checklist_id: int, db: Session = Depends(get_db)):
    checklist = crud.get_checklist(db, checklist_id)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    return checklist

@router.get("/public/{public_id}", response_model=schemas.ChecklistOut)
def get_public_checklist(public_id: str, db: Session = Depends(get_db)):
    checklist = crud.get_public_checklist(db, public_id)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    return checklist

# add routes
@router.post("/", response_model=schemas.ChecklistOut)
def create_checklist(checklist: schemas.ChecklistCreate, db: Session = Depends(get_db)):
    return crud.create_checklist(db, checklist)

@router.post("/{checklist_id}/categories", response_model=schemas.CategoryOut)
def add_category(checklist_id:int, category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    checklist = crud.get_checklist(db, checklist_id)
    if checklist:
        return crud.create_category(db, category, checklist_id)
    raise HTTPException(status_code=404, detail="Checklist not found")

@router.post("/{checklist_id}/categories/{category_id}/items", response_model=schemas.ItemOut)
def add_item(category_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)):
    category = crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    else:
        return crud.create_item(db, item, category_id)

#file upload routes    
@router.post("/{checklist_id}/categories/{category_id}/items/{item_id}/upload", response_model=schemas.FileOut)
async def upload_item_file(item_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    mock_url = f"/static/uploads/{file.filename}"
    return crud.create_file_url(db, mock_url, item_id=item_id)

@router.post("/{checklist_id}/categories/{category_id}/upload", response_model=schemas.FileOut)
async def upload_category_file(category_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    category = crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    mock_url = f"/static/uploads/{file.filename}"
    return crud.create_file_url(db, mock_url, category_id=category_id)

@router.post("/public/{public_id}/categories/{category_id}/items/{item_id}/upload", response_model=schemas.FileOut)
async def public_upload_to_item_file(item_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    mock_url = f"/static/uploads/{file.filename}"
    return crud.create_file_url(db, mock_url, item_id=item_id)

@router.post("/public/{public_id}/categories/{category_id}/upload", response_model=schemas.FileOut)
async def public_upload_to_category_file(category_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    category = crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    mock_url = f"/static/uploads/{file.filename}"
    return crud.create_file_url(db, mock_url, category_id=category_id)

# clone checklist
@router.post("{checklist_id}/clone", response_model=schemas.ChecklistOut)
def clone_checklist(checklist_id: int, db: Session = Depends(get_db)):
    checklist = crud.clone_checklist(db, checklist_id)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    return checklist

# delete routes
@router.delete("/{checklist_id}", response_model=schemas.ChecklistOut)
def delete_checklist(checklist_id: int, db: Session = Depends(get_db)):
    checklist = crud.delete_checklist(db, checklist_id)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    return checklist

@router.delete("/{checklist_id}/categories/{category_id}", response_model=schemas.CategoryOut)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = crud.delete_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.delete("/{checklist_id}/categories/{category_id}/items/{item_id}", response_model=schemas.ItemOut)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.delete_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.delete("/{checklist_id}/categories/{category_id}/items/{item_id}/files/{file_id}", response_model=schemas.FileOut)
def delete_file(file_id: int, db: Session = Depends(get_db)):
    file = crud.delete_file(db, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file

@router.delete("/public/{checklist_id}/categories/{category_id}/items/{item_id}/files/{file_id}", response_model=schemas.FileOut)
def public_delete_file(file_id: int, db: Session = Depends(get_db)):
    file = crud.delete_file(db, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file

# rename routes
@router.put("/{checklist_id}", response_model=schemas.ChecklistOut)
def rename_checklist(checklist_id: int, new_name: str = Form(...), db: Session = Depends(get_db)):
    checklist = crud.rename_checklist(db, checklist_id, new_name)
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    return checklist

@router.put("/{checklist_id}/categories/{category_id}", response_model=schemas.CategoryOut)
def rename_category(category_id: int, new_name: str = Form(...), db: Session = Depends(get_db)):
    category = crud.rename_category(db, category_id, new_name)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/{checklist_id}/categories/{category_id}/items/{item_id}", response_model=schemas.ItemOut)
def rename_item(item_id: int, new_name: str = Form(...), db: Session = Depends(get_db)):
    item = crud.rename_item(db, item_id, new_name)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item