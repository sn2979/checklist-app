from sqlalchemy.orm import Session
from app import models, schemas
from uuid_extensions import uuid7

# create functions
def create_checklist(db: Session, checklist: schemas.ChecklistCreate):
    db_checklist = models.Checklist(name=checklist.name)
    db.add(db_checklist)
    db.commit()
    db.refresh(db_checklist)
    db_checklist.public_id = f"{uuid7().hex}"
    db.commit()
    return db_checklist

def create_category(db: Session, category: schemas.CategoryCreate, checklist_id: int):
    db_category = models.Category(name=category.name, checklist_id=checklist_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def create_item(db: Session, item: schemas.ItemCreate, category_id: int):
    db_item = models.Item(name=item.name, category_id=category_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_file_url(db: Session, file_url, item_id: int = None, category_id: int = None):
    db_file = models.File(file_url=file_url, item_id=item_id, category_id=category_id)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

# clone checklist
def clone_checklist(db: Session, checklist_id: int):
    original = db.query(models.Checklist).filter(models.Checklist.id == checklist_id).first()
    if not original:
        return None
    
    new_checklist = models.Checklist(name=f"Copy of {original.name}")
    db.add(new_checklist)
    db.commit()
    db.refresh(new_checklist)

    for category in original.categories:
        new_category = models.Category(name=category.name, checklist_id = new_checklist.id)
        db.add(new_category)
        db.commit()

        for file in category.files:
            new_file = models.File(file_url=file.file_url, category_id=new_category.id)
            db.add(new_file)

        for item in category.items:
            new_item = models.Item(name=item.name, category_id=new_category.id)
            db.add(new_item)
            db.commit()
            db.refresh(new_item)

            for file in item.files:
                new_file = models.File(file_url = file.file_url, item_id=new_item.id)
                db.add(new_file)

    db.commit()
    return new_checklist

# delete functions
def delete_checklist(db: Session, checklist_id: int):
    db_checklist = db.query(models.Checklist).filter(models.Checklist.id == checklist_id).first()
    if db_checklist:
        db.delete(db_checklist)
        db.commit()
    return db_checklist

def delete_category(db: Session, category_id: int):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category

def delete_item(db: Session, item_id: int):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

def delete_file(db: Session, file_id: int):
    db_file = db.query(models.File).filter(models.File.id == file_id).first()
    if db_file:
        db.delete(db_file)
        db.commit()
    return db_file

# get functions
def get_all_checklists(db: Session):
    return db.query(models.Checklist).all()
def get_checklist(db: Session, checklist_id: int):
    return db.query(models.Checklist).filter(models.Checklist.id == checklist_id).first()

def get_public_checklist(db: Session, public_id: str):
    return db.query(models.Checklist).filter(models.Checklist.public_id == public_id).first()

def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_item(db: Session, item_id: int):
    return db.query(models.Item).filter(models.Item.id == item_id).first()

# renaming functions
def rename_checklist(db: Session, checklist_id: int, new_name: str):
    db_checklist = db.query(models.Checklist).filter(models.Checklist.id == checklist_id).first()
    if db_checklist:
        db_checklist.name = new_name
        db.commit()
        db.refresh(db_checklist)
    return db_checklist

def rename_category(db: Session, category_id: int, new_name: str):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category:
        db_category.name = new_name
        db.commit()
        db.refresh(db_category)
    return db_category

def rename_item(db: Session, item_id: int, new_name: str):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item:
        db_item.name = new_name
        db.commit()
        db.refresh(db_item)
    return db_item
