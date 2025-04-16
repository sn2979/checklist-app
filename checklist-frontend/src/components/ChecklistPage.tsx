import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Checklist } from '../types/models';

const ChecklistPage: React.FC = () => {
  const { id } = useParams();  // React Router grabs the ID from the URL
  const [checklist, setChecklist] = useState<Checklist | null>(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/checklists/${id}`)
      .then(response => {
        console.log("Fetched checklist:", response.data);
        setChecklist(response.data);
      })
      .catch(error => {
        console.error("Error fetching checklist:", error);
      });
  }, [id]);

  if (!checklist) return <div className="container mt-4">Loading...</div>;

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
  
  

  return (
    <div className="container mt-4">
      <h2>{checklist.name}</h2>

      {checklist.categories.map(category => (
        <div key={category.id} className="mb-4">
          <h4>📂 {category.name}</h4>
          <input
            type="file"
            onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                uploadCategoryFile(checklist.id, category.id, file);
                }
            }}
            className="form-control form-control-sm mb-2"
            />


          {/* Files directly on the category */}
          {category.files.length > 0 && (
            <ul>
              {category.files.map(file => (
                <li key={file.id}><a href={file.file_url}>{file.file_url}</a></li>
              ))}
            </ul>
          )}

          <ul className="list-group">
            {category.items.map(item => (
              <li key={item.id} className="list-group-item">
                <strong>{item.name}</strong>
                <input
                    type="file"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        uploadItemFile(checklist.id, category.id, item.id, file);
                        }
                    }}
                    className="form-control form-control-sm mt-2"
                />
                {item.files.length > 0 && (
                  <ul>
                    {item.files.map(file => (
                      <li key={file.id}><a href={file.file_url}>{file.file_url}</a></li>
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
