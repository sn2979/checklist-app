import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Checklist } from '../types/models';

const ChecklistPage: React.FC = () => {
  const { id } = useParams();  // React Router grabs the ID from the URL
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [itemInputs, setItemInputs] = useState<{ [categoryId: number]: string }>({});
  const [renamingCategoryId, setRenamingCategoryId] = useState<number | null>(null);
  const [renamingCategoryName, setRenamingCategoryName] = useState("");
  const [renamingItemId, setRenamingItemId] = useState<number | null>(null);
  const [renamingItemName, setRenamingItemName] = useState("");
  const [renamingName, setRenamingName] = useState(false);
  const [checklistName, setChecklistName] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/checklists/${id}`)
      .then(response => {
        console.log("Fetched checklist:", response.data);
        setChecklist(response.data);
        setChecklistName(response.data.name);  // populate editable name
        document.title = response.data.name;
      })
      .catch(error => {
        console.error("Error fetching checklist:", error);
      });
  }, [id]);

  if (!checklist) return <div className="container mt-4">Loading...</div>;

  const handleAddCategory = () => {
    if (!newCategoryName) return;

    axios.post(`http://localhost:8000/checklists/${id}/categories/`, {
        name: newCategoryName,
    }).then(() => {
        setNewCategoryName("");
        axios.get(`http://localhost:8000/checklists/${id}`)
        .then(res => setChecklist(res.data));
    });
   };

   const handleAddItem = (checklistId: number, categoryId: number) => {
    const name = itemInputs[categoryId];
    if (!name) return;
  
    axios.post(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}/items/`, {
      name: name
    }).then(() => {
      setItemInputs({ ...itemInputs, [categoryId]: "" });
      axios.get(`http://localhost:8000/checklists/${id}`)
        .then(res => setChecklist(res.data));
    });
  };

  const toggleRenamingCategory = (categoryId: number) => {
    setRenamingCategoryId(categoryId);
    const category = checklist?.categories.find(c => c.id === categoryId);
    setRenamingCategoryName(category?.name || "");
  };
  
  const handleRenameCategory = (checklistId: number, categoryId: number) => {
    axios.put(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}`, {
      name: renamingCategoryName
    }).then(() => {
      setRenamingCategoryId(null);
      setRenamingCategoryName("");
      axios.get(`http://localhost:8000/checklists/${id}`)
        .then(res => setChecklist(res.data));
    });
  };

  const toggleRenamingItem = (itemId: number) => {
    const foundItem = checklist?.categories.flatMap(c => c.items).find(i => i.id === itemId);
    setRenamingItemId(itemId);
    setRenamingItemName(foundItem?.name || "");
  };
  
  const handleRenameItem = (checklistId: number, categoryId: number, itemId: number) => {
    axios.put(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}/items/${itemId}`, {
      name: renamingItemName
    }).then(() => {
      setRenamingItemId(null);
      setRenamingItemName("");
      axios.get(`http://localhost:8000/checklists/${id}`)
        .then(res => setChecklist(res.data));
    });
  };

  const handleChecklistRename = () => {
    axios.put(`http://localhost:8000/checklists/${id}`, {
      name: checklistName
    }).then(res => {
      setChecklist(res.data);
      setRenamingName(false);
    });
  };
  


  const uploadItemFile = (checklistId: number, categoryId: number, itemId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    axios.post(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}/items/${itemId}/upload`, formData)
      .then(response => {
        console.log("File uploaded:", response.data);
        axios.get(`http://localhost:8000/checklists/${id}`)
          .then(res => setChecklist(res.data));
      })
      .catch(error => {
        console.error("File upload error:", error);
      });
  };

  const uploadCategoryFile = (checklistId: number, categoryId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    axios.post(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}/upload`, formData)
      .then(() => {
        axios.get(`http://localhost:8000/checklists/${id}`)
          .then(res => setChecklist(res.data));
      })
      .catch(error => {
        console.error("File upload error:", error);
      });
  };

  const deleteItemFile = (checklistId: number, categoryId: number, itemId: number, fileId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    axios.delete(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}/items/${itemId}/files/${fileId}`)
      .then(() => {
        // Refetch the checklist after deletion
        axios.get(`http://localhost:8000/checklists/${id}`)
          .then(res => setChecklist(res.data));
      })
      .catch(error => {
        console.error("Error deleting file:", error);
      });
  };

  const deleteCategoryFile = (checklistId: number, categoryId: number, fileId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    axios.delete(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}/files/${fileId}`)
      .then(() => {
        // Refetch the checklist after deletion
        axios.get(`http://localhost:8000/checklists/${id}`)
          .then(res => setChecklist(res.data));
      })
      .catch(error => {
        console.error("Error deleting file:", error);
      });
  };

  const deleteCategory = (checklistId: number, categoryId: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
  
    axios.delete(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}`)
      .then(() => axios.get(`http://localhost:8000/checklists/${id}`))
      .then(res => setChecklist(res.data));
  };
  
  const deleteItem = (checklistId: number, categoryId: number, itemId: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
  
    axios.delete(`http://localhost:8000/checklists/${checklistId}/categories/${categoryId}/items/${itemId}`)
      .then(() => axios.get(`http://localhost:8000/checklists/${id}`))
      .then(res => setChecklist(res.data));
  };

  return (
    <div className="container mt-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate("/")}>
        ⬅️ Back to My Checklists
        </button>

        {renamingName ? (
    <div className="d-flex mb-3">
        <input
        className="form-control me-2"
        value={checklistName}
        onChange={(e) => setChecklistName(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleChecklistRename}>Save</button>
    </div>
    ) : (
    <div className="d-flex align-items-center mb-3">
        <h2 className="me-3">{checklist.name}</h2>
        <button className="btn btn-sm btn-outline-secondary ms-2 me-2" onClick={() => setRenamingName(true)}>
        ✏️ Rename
        </button>
        <button
        className="btn btn-outline-info btn-sm"
        onClick={() => navigator.clipboard.writeText(`http://localhost:3000/checklists/public/${checklist.public_id}`)}
        >
        🔗 Copy Public Link
        </button>

        <button
            className="btn btn-outline-primary btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target={`#addCategoryModal-${checklist.id}`}
            >
            ➕ Add Category
          </button>
    </div>
    
    )}



          <div
            className="modal fade"
            id={`addCategoryModal-${checklist.id}`}
            tabIndex={-1}
            aria-labelledby={`addCategoryModalLabel-${checklist.id}`}
            aria-hidden="true"
            >
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={`addCategoryModalLabel-${checklist.id}`}>Add New Category</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                    <input
                    className="form-control"
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() => handleAddCategory()}
                    >
                    Add
                    </button>
                </div>
                </div>
            </div>
            </div>

      {checklist.categories.map(category => (
        <div key={category.id} className="mb-4">
          <h4>📂 {category.name}
            <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => toggleRenamingCategory(category.id)}
                >
                ✏️ Rename
            </button>
            <label className="btn btn-outline-secondary btn-sm ms-2">
            📎 Upload File
            <input
                type="file"
                hidden
                onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadCategoryFile(checklist.id, category.id, file);
                }}
            />
            </label>
            <button
            className="btn btn-outline-primary btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target={`#addItemModal-${category.id}`}
            >
            ➕ Add Item
          </button>

          <div
            className="modal fade"
            id={`addItemModal-${category.id}`}
            tabIndex={-1}
            aria-labelledby={`addItemModalLabel-${category.id}`}
            aria-hidden="true"
            >
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={`addItemModalLabel-${category.id}`}>Add New Item</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                    <input
                    className="form-control"
                    placeholder="Item name"
                    value={itemInputs[category.id] || ""}
                    onChange={(e) =>
                        setItemInputs({ ...itemInputs, [category.id]: e.target.value })
                    }
                    />
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() => handleAddItem(checklist.id, category.id)}
                    >
                    Add
                    </button>
                </div>
                </div>
            </div>
            </div>
            <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => deleteCategory(checklist.id, category.id)}
                >
                🗑️
            </button>
          </h4>
          {renamingCategoryId === category.id ? (
        <div className="d-flex my-2">
            <input
            className="form-control me-2"
            value={renamingCategoryName}
            onChange={(e) => setRenamingCategoryName(e.target.value)}
            />
            <button className="btn btn-success" onClick={() => handleRenameCategory(checklist.id, category.id)}>
            Save
            </button>
        </div>
        ) : null}



          {/* Files directly on the category */}
          {category.files.length > 0 && (
            <ul>
              {category.files.map(file => (
                <li key={file.id}><a href={file.file_url}>{file.file_url}</a>
                <a href={file.file_url} target="_blank" rel="noopener noreferrer">{file.file_url}</a>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => deleteCategoryFile(checklist.id, category.id, file.id)}
                >
                  🗑️
                </button>
                </li>
              ))}
            </ul>
          )}

          <ul className="list-group">
            {category.items.map(item => (
              <li key={item.id} className="list-group-item">
                <strong>{item.name}</strong>
                <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => toggleRenamingItem(item.id)}
                >
                ✏️ Rename
                </button>

                {renamingItemId === item.id && (
                <div className="d-flex mt-2">
                    <input
                    className="form-control me-2"
                    value={renamingItemName}
                    onChange={(e) => setRenamingItemName(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={() => handleRenameItem(checklist.id, category.id, item.id)}>
                    Save
                    </button>
                </div>
                )}

                <label className="btn btn-outline-secondary btn-sm ms-2">
                📎 Upload File
                <input
                    type="file"
                    hidden
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadItemFile(checklist.id, category.id, item.id, file);
                    }}
                />
                </label>

                <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => deleteItem(checklist.id, category.id, item.id)}
                >
                🗑️
                </button>


                {item.files.length > 0 && (
                  <ul>
                    {item.files.map(file => (
                      <li key={file.id} className="d-flex justify-content-between align-items-center">
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">{file.file_url}</a>
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => deleteItemFile(checklist.id, category.id, item.id, file.id)}
                      >
                        🗑️
                      </button>
                    </li>
                    
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>


        </div>
      ))}
    </div>
  );
};

export default ChecklistPage;
