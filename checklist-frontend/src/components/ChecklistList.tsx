import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Checklist } from '../types/models';

const ChecklistList: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newName, setNewName] = useState("");

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
                <h5 className="card-title">
                  <Link to={`/checklists/${checklist.id}`}>{checklist.name}</Link>
                </h5>
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
