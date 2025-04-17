import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Checklist } from '../types/models';

const ChecklistPage: React.FC = () => {
  const { publicId } = useParams();  // React Router grabs the public ID from the URL
  const [checklist, setChecklist] = useState<Checklist | null>(null);


  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/checklists/public/${publicId}`)
      .then(response => {
        console.log("Fetched checklist:", response.data);
        setChecklist(response.data);
        document.title = response.data.name + " - Public";
      })
      .catch(error => {
        console.error("Error fetching checklist:", error);
      });
  }, [publicId]);

  if (!checklist) return <div className="container mt-4">Loading...</div>;


  const uploadItemFile = (publicId: string, categoryId: number, itemId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    axios.post(`http://localhost:8000/checklists/public/${publicId}/categories/${categoryId}/items/${itemId}/upload`, formData)
      .then(response => {
        console.log("File uploaded:", response.data);
        axios.get(`http://localhost:8000/checklists/public/${publicId}`)
          .then(res => setChecklist(res.data));
      })
      .catch(error => {
        console.error("File upload error:", error);
      });
  };

  const uploadCategoryFile = (publicId: string, categoryId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    axios.post(`http://localhost:8000/checklists/${publicId}/categories/${categoryId}/upload`, formData)
      .then(() => {
        axios.get(`http://localhost:8000/checklists/public/${publicId}`)
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
          <h4>📂 {category.name}
          <label className="btn btn-outline-secondary btn-sm ms-4">
                📎 Upload File
                <input
                    type="file"
                    hidden
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCategoryFile(checklist.public_id, category.id, file);
                    }}
                />
            </label>
          </h4>


          {/* Files directly on the category */}
          {category.files.length > 0 && (
            <ul>
              {category.files.map(file => (
                <li key={file.id}><a href={file.file_url}>{file.file_url}</a>
                
                </li>
              ))}
            </ul>
          )}

        <div className="d-flex mt-2">
        </div>

          <ul className="list-group">
            {category.items.map(item => (
              <li key={item.id} className="list-group-item">
                <strong>{item.name}</strong>


                <label className="btn btn-outline-secondary btn-sm ms-3">
                📎 Upload File
                <input
                    type="file"
                    hidden
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadItemFile(checklist.public_id, category.id, item.id, file);
                    }}
                />
                </label>

                {item.files.length > 0 && (
                  <ul>
                    {item.files.map(file => (
                      <li key={file.id} className="d-flex justify-content-between align-items-center">
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">{file.file_url}</a>
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
