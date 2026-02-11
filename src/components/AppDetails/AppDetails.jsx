import { useParams, Link } from "react-router";
import { useState, useEffect } from 'react';
import * as appService from '../../services/appService';
import * as appFollowUp from '../../services/appFollowUp.js';
import * as checkInService from '../../services/checkInService';
import styles from "./AppDetails.module.css";
import { Briefcase, Pencil, Trash2, Save, X } from "lucide-react";
import Loading from '../Loading/Loading';



const AppDetails = (props) => {
    const { appId } = useParams();
    const [app, setApp] = useState(null);
    const [followUps, setFollowUps] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
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

  await checkInService.create(appId, {
    mood: Number(checkInFormData.mood),
    note: checkInFormData.note,
  });

  setCheckInFormData({ mood: "3", note: "" });
  fetchApp();
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

const visibleFollowUps = followUps.filter((followUp) => !followUp.isDone);

const handleComplete = async (followUp) => {
   setTimeout(() => {
    setFollowUps((prev) => prev.filter((f) => f._id !== followUp._id));
  }, 150);

  await props.handleUpdateFollowUp(appId, followUp._id, { isDone: true });
  fetchApp();
};

const moodEmoji = (mood) => {
  switch (Number(mood)) {
    case 1:
      return "😣";
    case 2:
      return "🙁";
    case 3:
      return "😐";
    case 4:
      return "🙂";
    case 5:
      return "😄";
    default:
      return "—";
  }
};

//   if (!app) return <main>Loading application...</main>;

if (!app) return <Loading text="Loading application…" />;

const isWorking = app.status === "working";

  return (
  <main className={styles.container}>
    <section className={`${styles.card} ${styles.cardInner}`}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            <Briefcase className={`${styles.iconMuted} ${styles.companyIcon}`} />
            {app.company}
          </h1>
        </div>

        <div className={styles.actions}>
          <Link to={`/applications/${appId}/edit`}>
            <button
              className={styles.iconBtn}
              type="button"
              aria-label="Edit application"
            >
              <Pencil className={styles.iconMuted} />
            </button>
          </Link>

          <button
            className={styles.iconBtn}
            type="button"
            onClick={handleDeleteApp}
            aria-label="Delete application"
          >
            <Trash2 className={styles.iconMuted} />
          </button>
        </div>
      </div>
    <div className={styles.metaColumns}>
  <div className={styles.metaCol}>
    <div className={styles.field}>
      <div className={styles.label}>Role</div>
      <div className={styles.value}>{app.roleTitle || "Not set"}</div>
    </div>

    <div className={styles.field}>
      <div className={styles.label}>Status</div>
      <div className={styles.value}>{app.status}</div>
    </div>

    <div className={styles.field}>
      <div className={styles.label}>Industry</div>
      <div className={styles.value}>{app.industry}</div>
    </div>
  </div>

  <div className={styles.metaCol}>
    <div className={styles.field}>
      <div className={styles.label}>Applied date</div>
      <div className={styles.value}>
        {app.appliedDate ? formatDate(app.appliedDate) : "Not set"}
      </div>
    </div>

    <div className={styles.field}>
      <div className={styles.label}>Location</div>
      <div className={styles.value}>{app.location || "Not set"}</div>
    </div>

    <div className={styles.field}>
      <div className={styles.label}>Salary range</div>
      <div className={styles.value}>{app.salaryRange || "Not set"}</div>
    </div>
  </div>

  <div className={styles.detailsWide}>
    <div className={styles.field}>
      <div className={styles.label}>Further details</div>
      <div className={`${styles.value} ${styles.longText}`}>
        {app.furtherDetails || "None"}
      </div>
    </div>
  </div>
      </div>
    </section>

    {!isWorking ? (
      <>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Follow-Ups</h2>
          <p className={`${styles.muted} ${styles.sectionSub}`}>
            Keep track of the next steps, mark it done when you’ve followed up.
          </p>
        </div>

        {visibleFollowUps.length === 0 ? (
          <section className={`${styles.card} ${styles.emptyCard}`}>
            <p className={styles.muted}>No follow-ups yet.</p>
          </section>
        ) : (
          <section className={`${styles.card} ${styles.tableCard}`}>
  <div className={styles.tableWrap}>
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th></th>
          <th>Due Date</th>
          <th>Note</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody className={styles.tbody}>
        {visibleFollowUps.map((followup) => (
          <tr key={followup._id} className={styles.row}>
            <td data-label="Done">
              <input
                type="checkbox"
                onChange={() => handleComplete(followup)}
                disabled={editingFollowUpId === followup._id}
              />
            </td>
            <td data-label="Due Date">
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
            <td data-label="Note">
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
            <td data-label="Status">
              {getDueStatus(followup.dueDate)}
            </td>
            <td className={styles.actionCell} data-label="Actions">
                <div className={styles.actionGroup}>
              {editingFollowUpId === followup._id ? (
                <>
                  <button
                    className={styles.miniIconBtn}
                    type="button"
                    onClick={() => saveEditFollowUp(followup)}
                    aria-label="Save"
                  >
                    <Save className={styles.miniIcon} />
                  </button>

                  <button
                    className={styles.miniIconBtn}
                    type="button"
                    onClick={cancelEditFollowUp}
                    aria-label="Cancel"
                  >
                    <X className={styles.miniIcon} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.miniIconBtn}
                    type="button"
                    onClick={() => startEditFollowUp(followup)}
                    aria-label="Edit"
                  >
                    <Pencil className={styles.miniIcon} />
                  </button>

                  <button
                    className={styles.miniIconBtn}
                    type="button"
                    onClick={() => handleDeleteFollowUp(followup._id)}
                    aria-label="Delete"
                  >
                    <Trash2 className={styles.miniIcon} />
                  </button>
                </>
              )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
        )}

        <section className={`${styles.card} ${styles.formCard}`}>
          <form onSubmit={handleAddFollowUp} className={styles.formGrid}>
            <div>
              <div>
                <label htmlFor="dueDate-input">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate-input"
                  value={followUpFormData.dueDate}
                  onChange={handleFollowUpChange}
                />
              </div>

              <div>
                <label htmlFor="note-input">Note</label>
                <textarea
                  name="note"
                  id="note-input"
                  value={followUpFormData.note}
                  onChange={handleFollowUpChange}
                  placeholder="write follow up email, ask for timeline, send thank you note..."
                />
              </div>
            </div>

            <button type="submit">Add Follow-Up</button>
          </form>
        </section>
      </>
    ) : (
      <>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Check-Ins</h2>
          <p className={`${styles.muted} ${styles.sectionSub}`}>
            Quick notes to reflect and spot patterns over time.
          </p>
        </div>

        {checkIns.length === 0 ? (
          <section className={`${styles.card} ${styles.emptyCard}`}>
            <p className={styles.muted}>No check-ins yet. Add your first check-in.</p>
          </section>
        ) : (
          <section className={`${styles.card} ${styles.tableCard}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.dateCol}>Date</th>
                    <th className={styles.moodCol}>Mood</th>
                    <th>Note</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody className={styles.tbody}>
                  {checkIns.map((checkin) => (
                    <tr key={checkin._id} className={styles.row}>
                      <td data-label="Date">
                        {checkin.date
                          ? formatDate(checkin.date)
                          : checkin.createdAt
                          ? formatDate(checkin.createdAt)
                          : "—"}
                      </td>

                  <td data-label="Mood">  <span className={styles.moodEmoji}>{moodEmoji(checkin.mood)}
                    </span>
                  </td>
                      <td data-label="Note">{checkin.note || "—"}</td>

                      <td className={styles.actionCell} data-label="Actions">
                          <div className={styles.actionGroup}>
                        <button className={styles.miniIconBtn} type="button" onClick={() => handleDeleteCheckIn(checkin._id)} aria-label="Delete">
                            <Trash2 className={styles.miniIcon} />
                        </button>
                        </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className={`${styles.card} ${styles.formCard}`}>
          <form onSubmit={handleAddCheckIn} className={styles.formGrid}>
            <div>
              <div>
                <label htmlFor="mood-input">Mood</label>
                <select
                  name="mood"
                  id="mood-input"
                  value={checkInFormData.mood}
                  onChange={handleCheckInChange}
                >
                  <option value="1">😣 Rough</option>
                  <option value="2">🙁 Low</option>
                  <option value="3">😐 Okay</option>
                  <option value="4">🙂 Good</option>
                  <option value="5">😄 Great</option>
                </select>
              </div>

              <div>
                <label htmlFor="checkin-note-input">Note</label>
                <textarea
                  name="note"
                  id="checkin-note-input"
                  value={checkInFormData.note}
                  onChange={handleCheckInChange}
                  placeholder="how is work going this week?"
                />
              </div>
            </div>

            <button type="submit">Add Check-In</button>
          </form>
        </section>
      </>
    )}
  </main>
);
}; 

export default AppDetails;