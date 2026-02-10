import { Link, useNavigate } from "react-router";
import styles from "./AppList.module.css";
import { Briefcase, Plus } from "lucide-react";

const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const AppList = ({ applications }) => {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <Briefcase size={26} color="rgba(18, 18, 58, 0.68)" />
            Your Applications</h1>
          <p className={styles.muted}>
            A simple overview of every role you’ve applied to. Click an application
            to update its status, manage follow-ups, or log check-ins.
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/applications/new">
            <button className={styles.addBtn}>
                <Plus size={20} />
                Add Application</button>
          </Link>
        </div>
      </div>

      {applications.length === 0 ? (
        <section className={`${styles.card} ${styles.emptyCard}`}>
          <p className={styles.muted}>
            No applications yet. Add one to start tracking your job search.
          </p>
        </section>
      ) : (
        <section className={`${styles.card} ${styles.tableWrap}${styles.tableCard}`}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Date</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className={styles.tbody}>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className={styles.row}
                  onClick={() => navigate(`/applications/${app._id}`)}
                >
                  <td data-label="Date">
                    {formatDate(app.appliedDate || app.createdAt)}
                  </td>
                  <td data-label="Company">{app.company}</td>
                  <td data-label="Role">{app.roleTitle}</td>
                  <td data-label="Status">
                    <span className={styles.status}>{app.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
};

export default AppList;