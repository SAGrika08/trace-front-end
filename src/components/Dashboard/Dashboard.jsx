import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as appService from "../../services/appService";
import * as followUpService from "../../services/appFollowUp";
import styles from "./Dashboard.module.css";
import Loading from "../Loading/Loading";

import { Plus, ArrowRight, ClipboardList, CalendarClock, Briefcase, AlertTriangle,} from "lucide-react";


const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [applications, setApplications] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      try {
        const apps = await appService.index();
        const safeApps = Array.isArray(apps) ? apps : [];
        setApplications(safeApps);

        const followUpResults = await Promise.all(
          safeApps.map(async (app) => {
            const appFollowUps = await followUpService.getFollowUps(app._id);
            if (!Array.isArray(appFollowUps)) return [];
            return appFollowUps.map((followUp) => ({
              ...followUp,
              appId: app._id,
              appName: app.company,
            }));
          })
        );

        setFollowUps(followUpResults.flat());
      } catch (err) {
        console.log(err);
        setApplications([]);
        setFollowUps([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  const totalApplications = applications.length;

  const inProgressApplications = applications.filter(
    (app) => app.status !== "rejected" && app.status !== "withdrawn"
  ).length;

  const workingApps = applications.filter((app) => app.status === "working");
  const currentRole = workingApps.length === 1 ? workingApps[0] : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);

  const pendingFollowUps = followUps.filter((followUp) => !followUp.isDone);

  const overdueFollowUps = pendingFollowUps
    .filter((followUp) => followUp.dueDate)
    .filter((followUp) => {
      const due = new Date(followUp.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const dueSoonFollowUps = pendingFollowUps
    .filter((followUp) => followUp.dueDate)
    .filter((followUp) => {
      const due = new Date(followUp.dueDate);
      due.setHours(0, 0, 0, 0);
      return due >= today && due <= in7Days;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));


  const nextUpFollowUps = [...overdueFollowUps, ...dueSoonFollowUps].slice(0, 5);

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

 const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

//   const getAppDateLabel = (app) => {
//     return app.appliedDate ? formatDate(app.appliedDate) : formatDate(app.createdAt);
//   };

  const getFollowUpTag = (followUp) => {
    if (!followUp.dueDate) return "No date";
    const due = new Date(followUp.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today ? "Overdue" : "Due soon";
  };

 
  if (isLoading) {
  return <Loading text="Loading your dashboard…" />;
}

return (
  <main className={styles.container}>
    <div className={styles.headerRow}>
      <h1 className={styles.title}>Welcome, {user?.username}</h1>

      <Link to="/applications/new" className={styles.ctaLink}>
        <button className={styles.ctaBtn} type="button">
          <Plus className={styles.ctaIcon} />
          Add Application
        </button>
      </Link>
    </div>

    <p className={styles.intro}>
      This is your space to manage your job journey. Track applications, keep follow-ups organized,
      and once you start working, log check-ins to reflect on how the role is going.
    </p>

    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Overview</h2>
      </div>

      <section className={`${styles.card} ${styles.overviewCard}`}>
        <div className={styles.overviewGrid}>
          <div className={styles.statItem}>
            <ClipboardList className={styles.statIcon} />
            <div className={styles.statText}>
              <div className={styles.statLabel}>Total applications</div>
              <div className={styles.statValue}>{totalApplications}</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <Briefcase className={styles.statIcon} />
            <div className={styles.statText}>
              <div className={styles.statLabel}>In progress</div>
              <div className={styles.statValue}>{inProgressApplications}</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <AlertTriangle className={styles.statIcon} />
            <div className={styles.statText}>
              <div className={styles.statLabel}>Overdue follow-ups</div>
              <div className={styles.statValue}>{overdueFollowUps.length}</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <CalendarClock className={styles.statIcon} />
            <div className={styles.statText}>
              <div className={styles.statLabel}>Current role</div>
              <div className={styles.statValue}>
                {currentRole ? (
                  <Link className={styles.inlineLink} to={`/applications/${currentRole._id}`}>
                    {currentRole.company} | {currentRole.roleTitle}
                  </Link>
                ) : (
                  <span className={styles.muted}>None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Follow-Ups to Do</h2>
        </div>

        {nextUpFollowUps.length === 0 ? (
          <section className={`${styles.card} ${styles.emptyCard}`}>
            <p className={styles.muted}>No overdue or upcoming follow-ups right now.</p>
          </section>
        ) : (
          <section className={`${styles.card} ${styles.tableCard}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>Due</th>
                    <th>Company</th>
                    <th>Note</th>
                    <th>Status</th>
                    <th className={styles.actionHead}></th>
                  </tr>
                </thead>

                <tbody className={styles.tbody}>
                  {nextUpFollowUps.map((followUp) => {
                    const tag = getFollowUpTag(followUp);
                    const isOverdue = tag === "Overdue";
                    return (
                      <tr key={followUp._id} className={styles.row}>
                        <td data-label="Due">{followUp.dueDate ? formatDate(followUp.dueDate) : "Not set"}</td>
                        <td data-label="Company">{followUp.appName}</td>
                        <td data-label="Note" className={styles.noteCell}>
                          {followUp.note || "—"}
                        </td>
                        <td data-label="Status">
                          <span className={`${styles.tag} ${isOverdue ? styles.tagOverdue : styles.tagSoon}`}>
                            {tag}
                          </span>
                        </td>
                        <td className={styles.actionCell} data-label="Action">
                          <Link to={`/applications/${followUp.appId}`} className={styles.iconActionLink}>
                            <button className={styles.miniIconBtn} type="button" aria-label="View application">
                              <ArrowRight className={styles.miniIcon} />
                            </button>
                          </Link>
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

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recently Added</h2>
        </div>

        {recentApplications.length === 0 ? (
          <section className={`${styles.card} ${styles.emptyCard}`}>
            <p className={styles.muted}>No applications yet. Add one to get started.</p>
          </section>
        ) : (
          <section className={`${styles.card} ${styles.tableCard}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className={styles.actionHead}></th>
                  </tr>
                </thead>

                <tbody className={styles.tbody}>
                  {recentApplications.map((app) => (
                    <tr key={app._id} className={styles.row}>
                      <td data-label="Date">{formatDate(app.appliedDate || app.createdAt)}</td>
                      <td data-label="Company">{app.company}</td>
                      <td data-label="Role" className={styles.noteCell}>
                        {app.roleTitle}
                      </td>
                      <td data-label="Status">{app.status}</td>
                      <td className={styles.actionCell} data-label="Action">
                        <Link to={`/applications/${app._id}`} className={styles.iconActionLink}>
                          <button className={styles.miniIconBtn} type="button" aria-label="View application">
                            <ArrowRight className={styles.miniIcon} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Current Role Check-In</h2>
        </div>

        {workingApps.length === 0 ? (
          <section className={`${styles.card} ${styles.emptyCard}`}>
            <p className={styles.muted}>No role is marked as working yet.</p>
          </section>
        ) : (
          <section className={`${styles.card} ${styles.tableCard}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className={styles.actionHead}></th>
                  </tr>
                </thead>

                <tbody className={styles.tbody}>
                  {workingApps.map((app) => (
                    <tr key={app._id} className={styles.row}>
                      <td data-label="Date">{formatDate(app.appliedDate || app.createdAt)}</td>
                      <td data-label="Company">{app.company}</td>
                      <td data-label="Role" className={styles.noteCell}>
                        {app.roleTitle}
                      </td>
                      <td data-label="Status">{app.status}</td>
                      <td className={styles.actionCell} data-label="Action">
                        <Link to={`/applications/${app._id}`} className={styles.iconActionLink}>
                          <button className={styles.miniIconBtn} type="button" aria-label="Add check-in">
                            <Plus className={styles.miniIcon} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default Dashboard;