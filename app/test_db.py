import app.database as database
import app.models as models

# opens a DB session
db = database.SessionLocal()

checklist = models.Checklist(name="Visa Application")
db.add(checklist)
db.commit()
db.refresh(checklist)

print("Checklist added:", checklist.name)

category = models.Category(name="Documents", checklist_id=checklist.id)
db.add(category)
db.commit()
db.refresh(category)

print("Category added:", category.name)

item = models.Item(name="Upload Passport", category_id=category.id)
db.add(item)
db.commit()
db.refresh(item)

print("Item added:", item.name)

file1 = models.File(file_url="http://example.com/passport.pdf", item_id=item.id)
db.add(file1)
db.commit()
db.refresh(file1)

print("File added:", file1.file_url)

file2 = models.File(file_url="http://example.com/visa_form.pdf", category_id=category.id)
db.add(file2)
db.commit()
db.refresh(file2)

print("File added:", file2.file_url)

db.close()