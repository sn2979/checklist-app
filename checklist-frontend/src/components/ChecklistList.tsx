import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Checklist } from '../types/models';

const ChecklistList: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newName, setNewName] = useState("");
  const [renamingChecklistId, setRenamingChecklistId] = useState<number | null>(null);
  const [renamingChecklistName, setRenamingChecklistName] = useState<string>("");


  // Fetch all checklists from backend
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/checklists/')
      .then(response => {
        console.log("Fetched checklists:", response.data);
        setChecklists(response.data);
      })
      .catch(error => {
        console.error("Error fetching checklists:", error);
      });
  }, []);

  const toggleRenameChecklist = (checklistId: number, currentName: string) => {
    setRenamingChecklistId(checklistId);
    setRenamingChecklistName(currentName);
  };
  
  const handleRenameChecklist = (checklistId: number) => {
    axios.put(`http://localhost:8000/checklists/${checklistId}`, {
      name: renamingChecklistName,
    }).then((res) => {
      setChecklists(checklists.map(cl =>
        cl.id === checklistId ? res.data : cl
      ));
      setRenamingChecklistId(null);
      setRenamingChecklistName("");
    });
  };
  

  const createChecklist = () => {
    if (!newName) return;
    axios.post('http://127.0.0.1:8000/checklists/', { name: newName })
      .then(response => {
        setChecklists([...checklists, response.data]);
        setNewName("");
      });
  };

  const deleteChecklist = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/checklists/${id}`)
      .then(() => {
        setChecklists(checklists.filter(c => c.id !== id));
      });
  };

  return (
    <div className="container mt-4">
      <h2>📝 My Checklists</h2>

      <div className="mb-3 d-flex">
        <input
          className="form-control me-2"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New checklist name"
        />
        <button className="btn btn-primary" onClick={createChecklist}>Add Checklist</button>
      </div>

      <div className="row">
        {checklists.map(checklist => (
          <div className="col-md-4" key={checklist.id}>
            <div className="card mb-3">
              <div className="card-body">
              {renamingChecklistId === checklist.id ? (
                <div className="d-flex">
                    <input
                    className="form-control me-2"
                    value={renamingChecklistName}
                    onChange={(e) => setRenamingChecklistName(e.target.value)}
                    />
                    <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleRenameChecklist(checklist.id)}
                    >
                    Save
                    </button>
                </div>
                ) : (
                <>
                    <h5 className="card-title">
                    <Link to={`/checklists/${checklist.id}`}>{checklist.name}</Link>
                    <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => toggleRenameChecklist(checklist.id, checklist.name)}
                    >
                     ✏️ 
                    </button>
                    </h5>
                    
                </>
                )}
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-danger" onClick={() => deleteChecklist(checklist.id)}>Delete</button>
                  {/* Buttons for Rename & Clone can go here */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistList;
