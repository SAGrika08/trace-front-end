import { useParams, Link } from "react-router";
import { useState, useEffect } from 'react';
import * as appService from '../../services/appService';
import * as appFollowUp from '../../services/appFollowUp.js';
import * as checkInService from '../../services/checkInService';



const AppDetails = (props) => {
    const { appId } = useParams();
    const [app, setApp] = useState(null);
    const [followUps, setFollowUps] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [editingCheckIn, setEditingCheckIn] = useState(null);
  const [editingFollowUpId, setEditingFollowUpId] = useState(null);
  const [followUpEditData, setFollowUpEditData] = useState({
    dueDate: "",
    note: "",
  });
    console.log('appId', appId);
 
const [followUpFormData, setFollowUpFormData] = useState({
  dueDate: "",
  note: "",
//   isDone: false,
});

const [checkInFormData, setCheckInFormData] = useState({
  mood: "3",
  note: "",
});

const fetchApp = async () => {
    const data = await appService.show(appId);
    setApp(data.application);
    setFollowUps(data.followUps || []);
    setCheckIns(data.checkIns || []);
  };

  useEffect(() => {
    fetchApp();
  }, [appId]);

const handleFollowUpChange = (evt) => {
    setFollowUpFormData({
      ...followUpFormData,
      [evt.target.name]: evt.target.value,
    });
  };

const handleAddFollowUp = async (evt) => {
  evt.preventDefault();

  if (!followUpFormData.dueDate) {
    alert("Please set a due date");
    return;
  }

  await appFollowUp.create(appId, {
      dueDate: followUpFormData.dueDate,
      note: followUpFormData.note,
    });

    setFollowUpFormData({ dueDate: "", note: "" });
    fetchApp();
  };


  const getDueStatus = (dueDate) => {
    if (!dueDate) return "No due date";
    const due = new Date(dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return due < today ? "Overdue" : "Upcoming";
  };

const startEditFollowUp = (followUp) => {
  setEditingFollowUpId(followUp._id);
  setFollowUpEditData({
    dueDate: followUp.dueDate ? followUp.dueDate.split("T")[0] : "",
    note: followUp.note || "",
  });
};

const handleEditFollowUpChange = (evt) => {
  const { name, value } = evt.target;
  setFollowUpEditData({ ...followUpEditData, [name]: value });
};

const cancelEditFollowUp = () => {
  setEditingFollowUpId(null);
  setFollowUpEditData({ dueDate: "", note: "" });
};

const saveEditFollowUp = async (followUp) => {
  await props.handleUpdateFollowUp(appId, followUp._id, {
    dueDate: followUpEditData.dueDate,
    note: followUpEditData.note,
  });
  setEditingFollowUpId(null);
  setFollowUpEditData({ dueDate: "", note: "" });
  fetchApp();
};

const handleDeleteFollowUp = async (followUpId) => {
  await props.handleDeleteFollowUp(appId, followUpId);
  fetchApp();
};

const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleCheckInChange = (evt) => {
  setCheckInFormData({
    ...checkInFormData,
    [evt.target.name]: evt.target.value,
  });
};

const handleAddCheckIn = async (evt) => {
  evt.preventDefault();

  if (!checkInFormData.note.trim()) {
    alert("Please write a note");
    return;
  }

  if (editingCheckIn) {
    await props.handleUpdateCheckIn(appId, editingCheckIn._id, {
      mood: Number(checkInFormData.mood),
      note: checkInFormData.note,
    });
    setEditingCheckIn(null);
  } else {
    await checkInService.create(appId, {
      mood: Number(checkInFormData.mood),
      note: checkInFormData.note,
    });
  }

  setCheckInFormData({ mood: "3", note: "" });
  fetchApp();
};

const handleEditCheckIn = (checkIn) => {
  setEditingCheckIn(checkIn);
  setCheckInFormData({
    mood: String(checkIn.mood),
    note: checkIn.note || "",
  });
};

const handleCancelEditCheckIn = () => {
  setEditingCheckIn(null);
  setCheckInFormData({ mood: "3", note: "" });
};

const handleDeleteCheckIn = async (checkInId) => {
  const deleted = await props.handleDeleteCheckIn(appId, checkInId);
  if (deleted) {
    fetchApp();
  }
};

const handleDeleteApp = async () => {
  if (window.confirm(`Are you sure you want to delete ${app.company}?`)) {
    try {
      await props.handleDeleteApp(appId);
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('Failed to delete application. Please try again.');
    }
  }
};


//fix
  if (!app) return <main>Loading application...</main>;


const isWorking = app.status === "working";

  return (
    <main>
      <h1>{app.company}</h1>

      <p><strong>Role:</strong> {app.roleTitle}</p>
      <p><strong>Status:</strong> {app.status}</p>
      <p><strong>Industry:</strong> {app.industry}</p>

      <p>
        <strong>Applied Date:</strong>{" "}
        {app.appliedDate
          ? new Date(app.appliedDate).toLocaleDateString()
          : "Not set"}
      </p>

      <p><strong>Location:</strong> {app.location || "Not set"}</p>
      <p><strong>Salary Range:</strong> {app.salaryRange || "Not set"}</p>

      <p><strong>Further Details:</strong></p>
      <p>{app.furtherDetails || "None"}</p>

      <p>
        <strong>Created:</strong>{" "}
        {new Date(app.createdAt).toLocaleString()}
      </p>

      <p>
        <strong>Last Updated:</strong>{" "}
        {new Date(app.updatedAt).toLocaleString()}
      </p>

      <Link to={`/applications/${appId}/edit`}>
        <button>Edit</button>
      </Link>
      <button onClick={handleDeleteApp}>Delete</button>

       {!isWorking ? (
        <>
          <h2>Follow-Ups</h2>
         <form onSubmit={handleAddFollowUp}>
            <label htmlFor="dueDate-input">Due Date</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate-input"
              value={followUpFormData.dueDate}
              onChange={handleFollowUpChange}
            />

            <label htmlFor="note-input">Note</label>
            <textarea
              name="note"
              id="note-input"
              value={followUpFormData.note}
              onChange={handleFollowUpChange}
              placeholder="write follow up email, ask for timeline, send thank you note..."
            />

            <button type="submit">Add Follow-Up</button>
          </form>
          {followUps.length === 0 ? (
            <p>No follow-ups yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #333" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Due Date</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Note</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "left" }}></th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((followup) => (
                  <tr key={followup._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>
                      {editingFollowUpId === followup._id ? (
                        <input
                          type="date"
                          name="dueDate"
                          value={followUpEditData.dueDate}
                          onChange={handleEditFollowUpChange}
                        />
                      ) : followup.dueDate ? (
                        formatDate(followup.dueDate)
                      ) : (
                        "Not set"
                      )}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {editingFollowUpId === followup._id ? (
                        <input
                          type="text"
                          name="note"
                          value={followUpEditData.note}
                          onChange={handleEditFollowUpChange}
                        />
                      ) : (
                        followup.note || "—"
                      )}
                    </td>
                    <td style={{ padding: "10px" }}>{getDueStatus(followup.dueDate)}</td>
                    <td style={{ padding: "10px" }}>
                      {editingFollowUpId === followup._id ? (
                        <>
                          <button type="button" onClick={() => saveEditFollowUp(followup)}>
                            Save
                          </button>
                          <button type="button" onClick={cancelEditFollowUp}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => startEditFollowUp(followup)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDeleteFollowUp(followup._id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <>
        <h2>Check-Ins</h2>
         <form onSubmit={handleAddCheckIn}>
            <label htmlFor="mood-input">Mood (1–5)</label>
            <select
              name="mood"
              id="mood-input"
              value={checkInFormData.mlshange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label htmlFor="checkin-note-input">Note</label>
            <textarea
              name="note"
              id="checkin-note-input"
              value={checkInFormData.note}
              onChange={handleCheckInChange}
              placeholder="how is work going this week?"
            />

            <button type="submit">{editingCheckIn ? 'UPDATE CHECK-IN' : 'Add Check-In'}</button>
            {editingCheckIn && (
              <button type="button" onClick={handleCancelEditCheckIn}>CANCEL</button>
            )}
          </form>

        {checkIns.length === 0 ? (
         <p>No check-ins yet.Add your first check-in.</p>
    ) : (
        checkIns.map((checkin) => (
      <div key={checkin._id}>
        <p>
          Date:{" "}
          {checkin.date
            ? new Date(checkin.date).toLocaleDateString()
            : checkin.createdAt
            ? new Date(checkin.createdAt).toLocaleDateString()
            : ""}
        </p>
        <p>Mood: {checkin.mood}</p>
        <p>Note: {checkin.note}</p>
        <button onClick={() => handleEditCheckIn(checkin)}>Edit</button>
        <button onClick={() => handleDeleteCheckIn(checkin._id)}>Delete</button>
        <hr />
      </div>
    ))
  )}
  </>
 )}
    </main>
  );
};

export default AppDetails;