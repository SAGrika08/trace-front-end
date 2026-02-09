import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import * as appService from "../../services/appService";
import * as followUpService from "../../services/appFollowUp";

const FollowUpsPage = (props) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [allFollowUps, setAllFollowUps] = useState([]);

  const [formData, setFormData] = useState({
    selectedAppId: "",
    dueDate: "",
    note: "",
    isDone: false,
  });

  const fetchFollowUps = async (apps) => {
    const followUpsData = [];
    for (const app of apps) {
      const followUps = await followUpService.getFollowUps(app._id);
      if (Array.isArray(followUps)) {
        followUpsData.push(...followUps.map((fu) => ({ ...fu, appId: app._id, appName: app.company })));
      }
    }
    setAllFollowUps(followUpsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    const fetchApplications = async () => {
      const apps = await appService.index();
      setApplications(apps);
      await fetchFollowUps(apps);
    };
    fetchApplications();
  }, []);

  const handleChange = (evt) => {
    const { name, type, checked, value } = evt.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (!formData.selectedAppId || !formData.dueDate) {
      alert("Please select an application and set a due date");
      return;
    }

    const payload = {
      dueDate: formData.dueDate,
      note: formData.note,
      isDone: formData.isDone,
    };

    props.handleAddFollowUp({ ...payload, selectedAppId: formData.selectedAppId });
    setFormData({ selectedAppId: "", dueDate: "", note: "", isDone: false });
    
    // Refresh the follow-ups list after a short delay to allow backend to process
    setTimeout(handleFollowUpCreated, 500);
  };

  const handleFollowUpCreated = async () => {
    const apps = await appService.index();
    setApplications(apps);
    await fetchFollowUps(apps);
  };

  return (
    <main>
      <h1>Add Follow-Up</h1>

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

        <label htmlFor="isDone-input">
          <input
            type="checkbox"
            name="isDone"
            id="isDone-input"
            checked={formData.isDone}
            onChange={handleChange}
          />
          Mark as Done
        </label>

        <button type="submit">SUBMIT</button>
      </form>

      <hr />

      <h2>Your Follow-Ups</h2>
      {allFollowUps.length === 0 ? (
        <p>No follow-ups yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #333" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Application</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Due Date</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Note</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {allFollowUps.map((followUp) => (
              <tr key={followUp._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{followUp.appName}</td>
                <td style={{ padding: "10px" }}>
                  {followUp.dueDate ? new Date(followUp.dueDate).toLocaleDateString() : "Not set"}
                </td>
                <td style={{ padding: "10px" }}>{followUp.note}</td>
                <td style={{ padding: "10px" }}>
                  {followUp.isDone ? <strong>✓ Done</strong> : "Pending"}
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