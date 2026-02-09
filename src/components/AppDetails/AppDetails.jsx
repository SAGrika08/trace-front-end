import { useParams } from "react-router";
import { useState, useEffect } from 'react';
import * as appService from '../../services/appService';
import * as appFollowUp from '../../services/appFollowUp.js';
import * as checkInService from '../../services/checkInService';



const AppDetails = () => {
    const { appId } = useParams();
    const [app, setApp] = useState(null);
    const [followUps, setFollowUps] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
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
    if (!dueDate) return "";
    const due = new Date(dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return due < today ? "Overdue" : "Upcoming";
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

  await checkInService.create(appId, {
    mood: Number(checkInFormData.mood),
    note: checkInFormData.note,
  });

  setCheckInFormData({ mood: "3", note: "" });
  fetchApp(); 
};

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
            followUps.map((followup) => (
              <div key={followup._id}>
                <p>
                  Due:{" "}
                  {followup.dueDate
                    ? new Date(followup.dueDate).toLocaleDateString()
                    : "Not set"}
                </p>
                <p>{followup.note}</p>
                <p>Status: {getDueStatus(followup.dueDate)}</p>
              </div>
            ))
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
              value={checkInFormData.mood}
              onChange={handleCheckInChange}
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

            <button type="submit">Add Check-In</button>
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