from sqlalchemy import Column, Integer, String, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Checklist(Base):
    __tablename__ = "checklists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    public_id = Column(String, index=True, unique=True)

    categories = relationship("Category", back_populates="checklist", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    checklist_id = Column(Integer, ForeignKey("checklists.id"), nullable=False)

    checklist = relationship("Checklist", back_populates="categories")
    items = relationship("Item", back_populates="category", cascade="all, delete-orphan")
    files = relationship("File", back_populates="category", cascade="all, delete-orphan")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    category = relationship("Category", back_populates="items")
    files = relationship("File", back_populates="item", cascade="all, delete-orphan")

class File(Base):
    __tablename__= "files"
    id = Column(Integer, primary_key=True, index=True)
    file_url = Column(Text, nullable=False)

    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    item = relationship("Item", back_populates="files")
    category = relationship("Category", back_populates="files")

    __table_args__ = (
        CheckConstraint(
            "(item_id IS NOT NULL AND category_id IS NULL) OR (item_id IS NULL AND category_id IS NOT NULL)",
            name="one_foreign_key_must_be_null"
        ),
    )