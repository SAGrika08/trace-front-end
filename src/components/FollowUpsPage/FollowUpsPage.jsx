import { useState, useEffect } from "react";
import * as appService from "../../services/appService";
import * as followUpService from "../../services/appFollowUp.js";

const FollowUpsPage = (props) => {
  const [applications, setApplications] = useState([]);
  const [allFollowUps, setAllFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    selectedAppId: "",
    dueDate: "",
    note: "",
    // isDone: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    dueDate: "",
    note: "",
  });


 const fetchFollowUps = async (apps) => {
    const results = await Promise.all(
      apps.map(async (app) => {
        const followUps = await followUpService.getFollowUps(app._id);
        if (!Array.isArray(followUps)) return [];
        return followUps.map((followUp) => ({
          ...followUp,
          appId: app._id,
          appName: app.company,
        }));
      })
    );

    const followUpsData = results.flat();
    followUpsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setAllFollowUps(followUpsData);
  };

const handleFollowUpCreated = async () => {
    setIsLoading(true);
    try {
      const apps = await appService.index();
      setApplications(apps);
      await fetchFollowUps(apps);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleFollowUpCreated();
  }, []);


  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  const getStatus = (followUp) => {
    if (!followUp.dueDate) return "No due date";

    const due = new Date(followUp.dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return due < today ? "Overdue" : "Upcoming";
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!formData.selectedAppId || !formData.dueDate) {
      alert("Please select an application and set a due date");
      return;
    }

    await props.handleAddFollowUp({
      selectedAppId: formData.selectedAppId,
      dueDate: formData.dueDate,
      note: formData.note,
    });

    setFormData({ selectedAppId: "", dueDate: "", note: "" });
    await handleFollowUpCreated();
  };

  const handleDelete = async (appId, followUpId) => {
    await props.handleDeleteFollowUp(appId, followUpId);
   await handleFollowUpCreated();
  };

  const startEdit = (followUp) => {
    setEditingId(followUp._id);
    setEditData({
      dueDate: followUp.dueDate ? followUp.dueDate.split("T")[0] : "",
      note: followUp.note || "",
    });
  };

  const handleEditChange = (evt) => {
    const { name, value } = evt.target;
    setEditData({ ...editData, [name]: value });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ dueDate: "", note: "" });
  };

  const saveEdit = async (followUp) => {
    await props.handleUpdateFollowUp(followUp.appId, followUp._id, {
      dueDate: editData.dueDate,
      note: editData.note,
    });

    setEditingId(null);
    setEditData({ dueDate: "", note: "" });
    await handleFollowUpCreated();
  };

 const visibleFollowUps = allFollowUps.filter((followUp) => !followUp.isDone);
const handleComplete = async (followUp) => {
  setAllFollowUps((prev) => prev.filter((f) => f._id !== followUp._id));
  await props.handleUpdateFollowUp(followUp.appId, followUp._id, {
    isDone: true,
  });
   await handleFollowUpCreated();
};

const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
  return (
    <main>
       <h1>Follow-Ups</h1>
        <p>
        Track your next actions for each application in one place.
        Add reminders for emails, calls, or messages, update them if plans change,
        and check them off when done.
        </p>
      <h2>Add Follow-Up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="selectedAppId-input">Application</label>
        <select
          required
          name="selectedAppId"
          id="selectedAppId-input"
          value={formData.selectedAppId}
          onChange={handleChange}
        >
          <option value="">-- Select Application --</option>
          {applications.map((app) => (
            <option key={app._id} value={app._id}>
              {app.company}
            </option>
          ))}
        </select>

        <label htmlFor="dueDate-input">Due Date</label>
        <input
          type="date"
          name="dueDate"
          id="dueDate-input"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <label htmlFor="note-input">Note</label>
        <textarea
          name="note"
          id="note-input"
          placeholder="Add a note..."
          value={formData.note}
          onChange={handleChange}
        />

        <button type="submit">Add</button>
      </form>

      <hr />

      <h2>Your Follow-Ups</h2>
      {isLoading ? (
      <p>Loading follow-ups...</p>
      ) : visibleFollowUps.length === 0 ? (
      <p>No follow-ups yet.</p>
        ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #333" }}>
              <th style={{ padding: "10px", textAlign: "center" }}></th>
              <th style={{ padding: "10px", textAlign: "left" }}>Application</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Due Date</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Note</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "10px", textAlign: "left" }}></th>
            </tr>
          </thead>
         <tbody>
  {visibleFollowUps.map((followUp) => (
    <tr
      key={followUp._id}
      style={{ borderBottom: "1px solid #ddd" }}
    >
      <td style={{ padding: "10px", textAlign: "center" }}>
        <input
          type="checkbox"
          onChange={() => handleComplete(followUp)}
          disabled={editingId === followUp._id}
        />
      </td>
      <td style={{ padding: "10px" }}>
        {followUp.appName}
      </td>
      <td style={{ padding: "10px" }}>
        {editingId === followUp._id ? (
          <input
            type="date"
            name="dueDate"
            value={editData.dueDate}
            onChange={handleEditChange}
          />
        ) : followUp.dueDate ? (
          formatDate(followUp.dueDate)
        ) : (
          "Not set"
        )}
      </td>
      <td style={{ padding: "10px" }}>
        {editingId === followUp._id ? (
          <input
            type="text"
            name="note"
            value={editData.note}
            onChange={handleEditChange}
          />
        ) : (
          followUp.note || "—"
        )}
      </td>
      <td style={{ padding: "10px" }}>
        {getStatus(followUp)}
      </td>
      <td style={{ padding: "10px" }}>
        {editingId === followUp._id ? (
          <>
            <button
              type="button"
              onClick={() => saveEdit(followUp)}
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => startEdit(followUp)}
            >
              Edit
            </button>
            <button type="button" onClick={() => handleDelete(followUp.appId, followUp._id)}>
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
    </main>
  );
};

export default FollowUpsPage;