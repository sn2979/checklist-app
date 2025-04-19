import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Checklist } from "../types/models";
import { Modal } from "bootstrap";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "localhost:8000";
const ChecklistList: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newName, setNewName] = useState("");
  const [renamingChecklistId, setRenamingChecklistId] = useState<number | null>(
    null
  );
  const [renamingChecklistName, setRenamingChecklistName] =
    useState<string>("");
  const [cloneNames, setCloneNames] = useState<{ [id: number]: string }>({});
  const navigate = useNavigate();

  // changes the title
  useEffect(() => {
    document.title = "My Checklists";
  }, []);

  // Fetch all checklists from backend
  useEffect(() => {
    axios
      .get(`http://${BASE_URL}/checklists/`)
      .then((response) => {
        console.log("Fetched checklists:", response.data);
        setChecklists(response.data);
      })
      .catch((error) => {
        console.error("Error fetching checklists:", error);
      });
  }, []);

  const toggleRenameChecklist = (checklistId: number, currentName: string) => {
    setRenamingChecklistId(checklistId);
    setRenamingChecklistName(currentName);
  };

  const handleRenameChecklist = (checklistId: number) => {
    axios
      .put(`http://${BASE_URL}/checklists/${checklistId}`, {
        name: renamingChecklistName,
      })
      .then((res) => {
        setChecklists(
          checklists.map((cl) => (cl.id === checklistId ? res.data : cl))
        );
        setRenamingChecklistId(null);
        setRenamingChecklistName("");
      });
  };

  const deleteChecklist = (id: number) => {
    axios.delete(`http://${BASE_URL}/checklists/${id}`).then(() => {
      setChecklists(checklists.filter((c) => c.id !== id));
    });
  };

  const handleModalCreate = () => {
    if (!newName.trim()) return;

    axios
      .post(`http://${BASE_URL}/checklists/`, { name: newName })
      .then((response) => {
        setChecklists([...checklists, response.data]);
        setNewName("");

        const modalEl = document.getElementById("addChecklistModal");
        const modal = Modal.getInstance(modalEl!);
        modal?.hide();
      });
  };

  const handleCloneChecklist = (originalId: number) => {
    const name =
      cloneNames[originalId] ||
      "Copy of " + checklists.find((c) => c.id === originalId)?.name;

    axios
      .post(`http://${BASE_URL}/checklists/${originalId}/clone`, { name })
      .then((res) => {
        const newChecklist = res.data;
        navigate(`/checklists/${newChecklist.id}`);
      })
      .catch((err) => {
        console.error("Error cloning checklist:", err);
      });
  };

  return (
    <div className="container mt-4">
      <h2>📝 My Checklists</h2>

      <div className="input-group mb-4">
        <button
          className="btn btn-primary mb-4"
          data-bs-toggle="modal"
          data-bs-target="#addChecklistModal"
        >
          ➕ Add Checklist
        </button>
      </div>

      <div
        className="modal fade"
        id="addChecklistModal"
        tabIndex={-1}
        aria-labelledby="addChecklistModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addChecklistModalLabel">
                Create New Checklist
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Enter checklist name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleModalCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {checklists.map((checklist) => (
          <div className="col-md-4" key={checklist.id}>
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-body">
                {renamingChecklistId === checklist.id ? (
                  <div className="d-flex align-items-center">
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
                    <h5 className="card-title d-flex justify-content-between align-items-center">
                      <Link
                        to={`/checklists/${checklist.id}`}
                        className="text-decoration-none text-dark"
                      >
                        {checklist.name}
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          toggleRenameChecklist(checklist.id, checklist.name)
                        }
                        title="Rename"
                      >
                        ✏️
                      </button>
                    </h5>
                  </>
                )}

                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteChecklist(checklist.id)}
                  >
                    🗑️ Delete
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target={`#cloneChecklistModal-${checklist.id}`}
                  >
                    🌀 Clone
                  </button>
                </div>
              </div>
              <div
                className="modal fade"
                id={`cloneChecklistModal-${checklist.id}`}
                tabIndex={-1}
                aria-labelledby={`cloneChecklistModalLabel-${checklist.id}`}
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5
                        className="modal-title"
                        id={`cloneChecklistModalLabel-${checklist.id}`}
                      >
                        Clone Checklist
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                      />
                    </div>
                    <div className="modal-body">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Copy of ${checklist.name}`}
                        value={cloneNames[checklist.id] || ""}
                        onChange={(e) =>
                          setCloneNames({
                            ...cloneNames,
                            [checklist.id]: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                        onClick={() => handleCloneChecklist(checklist.id)}
                      >
                        Clone
                      </button>
                    </div>
                  </div>
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
