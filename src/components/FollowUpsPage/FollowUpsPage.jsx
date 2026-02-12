import { useState, useEffect } from "react";
import * as appService from "../../services/appService";
import * as followUpService from "../../services/appFollowUp.js";
import styles from "./FollowUpsPage.module.css";
import { CheckSquare, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import Loading from "../Loading/Loading";

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
<main className={styles.container}>
       <div className={styles.headerRow}>
         <h1 className={styles.title}>
          <CheckSquare className={styles.titleIcon} />
          Follow-Ups
        </h1>
        </div>
        
        <p className={styles.intro}>
        Track your next actions for each application in one place.
        Add reminders for emails, calls, or messages, update them if plans change,
        and check them off when done.
        </p>
       <section className={`${styles.card} ${styles.formCard}`}>
<div className={styles.sectionHeader}>
  <h2 className={styles.sectionTitle}>Add Follow-Up</h2>

  <button type="submit" form="followup-form" className={styles.ctaBtn}>
    <Plus className={styles.ctaIcon} />
    Add
  </button>
</div>

  <form   id="followup-form" onSubmit={handleSubmit} className={styles.formGrid}>
    <div className={styles.formLeft}>
      <div className={styles.field}>
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
      </div>

      <div className={styles.field}>
        <label htmlFor="dueDate-input">Due Date</label>
        <input
          type="date"
          name="dueDate"
          id="dueDate-input"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className={styles.formRight}>
      <div className={styles.field}>
        <label htmlFor="note-input">Note</label>
        <textarea
          name="note"
          id="note-input"
          placeholder="Write the follow-up email, ask for a timeline, send thank you note..."
          value={formData.note}
          onChange={handleChange}
        />
      </div>
    </div>
  </form>
</section>

          <section className={styles.section}>
  <div className={styles.sectionHeader}>
    <h2 className={styles.sectionTitle}>Your Follow-Ups</h2>
  </div>

  {isLoading ? (

  <Loading variant="inline" text="Loading follow-ups…" />
  ) : visibleFollowUps.length === 0 ? (
    <section className={`${styles.card} ${styles.emptyCard}`}>
      <p className={styles.muted}>No follow-ups yet.</p>
    </section>
  ) : (
    <section className={`${styles.card} ${styles.tableCard}`}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.checkCol}></th>
              <th>Application</th>
              <th>Due</th>
              <th>Note</th>
              <th>Status</th>
              <th className={styles.actionHead}></th>
            </tr>
          </thead>

          <tbody className={styles.tbody}>
            {visibleFollowUps.map((followUp) => {
              const status = getStatus(followUp);

              return (
                <tr key={followUp._id} className={styles.row}>
                  <td className={styles.checkCell} data-label="Done">
                    <input
                      type="checkbox"
                      onChange={() => handleComplete(followUp)}
                      disabled={editingId === followUp._id}
                    />
                  </td>

                  <td data-label="Application">{followUp.appName}</td>

                  <td data-label="Due">
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
                      "—"
                    )}
                  </td>

                  <td data-label="Note" className={styles.noteCell}>
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

                  <td data-label="Status">
                    <span className={styles.statusText}>{status}</span>
                  </td>

                  <td className={styles.actionCell} data-label="Action">
                    <div className={styles.actionGroup}>
                      {editingId === followUp._id ? (
                        <>
                          <button
                            type="button"
                            className={styles.miniIconBtn}
                            onClick={() => saveEdit(followUp)}
                            aria-label="Save"
                          >
                            <Save className={styles.miniIcon} />
                          </button>
                          <button
                            type="button"
                            className={styles.miniIconBtn}
                            onClick={cancelEdit}
                            aria-label="Cancel"
                          >
                            <X className={styles.miniIcon} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.miniIconBtn}
                            onClick={() => startEdit(followUp)}
                            aria-label="Edit"
                          >
                            <Pencil className={styles.miniIcon} />
                          </button>
                          <button
                            type="button"
                            className={styles.miniIconBtn}
                            onClick={() =>
                              handleDelete(followUp.appId, followUp._id)
                            }
                            aria-label="Delete"
                          >
                            <Trash2 className={styles.miniIcon} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  )}
</section>
    </main>
  );
};

export default FollowUpsPage;