import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as appService from "../../services/appService";
import * as followUpService from "../../services/appFollowUp";

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

  const getAppDateLabel = (app) => {
    // show appliedDate if present, otherwise createdAt
    return app.appliedDate ? formatDate(app.appliedDate) : formatDate(app.createdAt);
  };

  const getFollowUpTag = (followUp) => {
    if (!followUp.dueDate) return "No date";
    const due = new Date(followUp.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today ? "Overdue" : "Due soon";
  };

 
  if (isLoading) {
    return (
      <main>
        <h1>Welcome, {user?.username}</h1>
        <p>Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Welcome, {user?.username}</h1>

      <Link to="/applications/new">
        <button>Add Application</button>
      </Link>

      <p>
        This is your space to manage your job journey. Track applications as you apply,
        keep follow-ups organized so nothing slips through, and once you start working,
        log regular check-ins to reflect on how the role is going.
        </p>

      <section>
        <h2>Overview</h2>

        <div>
          <p>
            <strong>Total applications:</strong> {totalApplications}
          </p>
          <p>
            <strong>In progress:</strong> {inProgressApplications}
          </p>
          <p>
            <strong>Overdue follow-ups:</strong> {overdueFollowUps.length}
          </p>
          <p>
            <strong>Current role:</strong>{" "}
            {currentRole ? (
              <Link to={`/applications/${currentRole._id}`}>
                {currentRole.company} | {currentRole.roleTitle}
              </Link>
            ) : (
              "None"
            )}
          </p>
        </div>
      </section>

      <hr />

      <section>
        <h2>Follow-Ups to Do</h2>

         {nextUpFollowUps.length === 0 ? (
    <p>No overdue or upcoming follow-ups right now.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #333" }}>
          <th style={{ padding: "10px", textAlign: "left" }}>Due</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Company</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Note</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
          <th style={{ padding: "10px", textAlign: "left" }}></th>
        </tr>
      </thead>

      <tbody>
        {nextUpFollowUps.map((followUp) => (
          <tr key={followUp._id} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>{followUp.dueDate ? formatDate(followUp.dueDate) : "Not set"}</td>

            <td style={{ padding: "10px" }}>{followUp.appName}</td>

            <td style={{ padding: "10px" }}>{followUp.note || "—"}</td>

            <td style={{ padding: "10px" }}>{getFollowUpTag(followUp)}</td>

            <td style={{ padding: "10px" }}>
              <Link to={`/applications/${followUp.appId}`}>
                <button type="button">View</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>


      <section>
        <h2>Recently Added</h2>

      {recentApplications.length === 0 ? (
    <p>No applications yet. Add one to get started.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #333" }}>
          <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Company</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Role</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
          <th style={{ padding: "10px", textAlign: "left" }}></th>
        </tr>
      </thead>

      <tbody>
        {recentApplications.map((app) => (
          <tr key={app._id} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>{formatDate(app.appliedDate || app.createdAt)}</td>
            <td style={{ padding: "10px" }}>{app.company}</td>
            <td style={{ padding: "10px" }}>{app.roleTitle}</td>
            <td style={{ padding: "10px" }}>{app.status}</td>

            <td style={{ padding: "10px" }}>
              <Link to={`/applications/${app._id}`}>
                <button type="button">View</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>

      <section>
        <h2>Current Role Check-In</h2>
        {workingApps.length === 0 ? (
    <p>No role is marked as working yet.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #333" }}>
          <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Company</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Role</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
          <th style={{ padding: "10px", textAlign: "left" }}></th>
        </tr>
      </thead>

      <tbody>
        {workingApps.map((app) => (
          <tr key={app._id} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>
             {formatDate(app.appliedDate || app.createdAt)}
            </td>
            <td style={{ padding: "10px" }}>{app.company}</td>
            <td style={{ padding: "10px" }}>{app.roleTitle}</td>
            <td style={{ padding: "10px" }}>{app.status}</td>

            {/* <td style={{ padding: "10px" }}>
              <Link to={`/applications/${app._id}`}>
                <button type="button">View</button>
              </Link>
            </td> */}
            <td style={{ padding: "10px" }}>
                <Link to={`/applications/${app._id}`}>
                <button type="button">Add</button>
                </Link>{" "}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>
    </main>
  );
};

export default Dashboard;