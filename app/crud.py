from sqlalchemy.orm import Session
from app import models, schemas

def create_checklist(db: Session, checklist: schemas.ChecklistCreate):
    db_checklist = models.Checklist(name=checklist.name)
    db.add(db_checklist)
    db.commit()
    db.refresh(db_checklist)
    return db_checklist

def get_checklist(db: Session, checklist_id: int):
    return db.query(models.Checklist).filter(models.Checklist.id == checklist_id).first()

def create_category(db: Session, category: schemas.CategoryCreate, checklist_id: int):
    db_category = models.Category(name=category.name, checklist_id=checklist_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def create_item(db: Session, item: schemas.ItemCreate, category_id: int):
    db_item = models.Item(name=item.name, category_id=category_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_item(db: Session, item_id: int):
    return db.query(models.Item).filter(models.Item.id == item_id).first()

def create_file_url(db: Session, file_url, item_id: int = None, category_id: int = None):
    db_file = models.File(file_url=file_url, item_id=item_id, category_id=category_id)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file