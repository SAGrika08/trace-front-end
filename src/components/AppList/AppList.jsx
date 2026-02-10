import { Link, useNavigate } from "react-router";

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
    <main>
      <h1>Your Applications</h1>
      <Link to="/applications/new">
        <button>Add Application</button>
      </Link>

        <p>
        A simple overview of every role you’ve applied to. Click an application to update its status,
        manage follow-ups, or log check-ins.
        </p>

      {applications.length === 0 ? (
        <p>No applications yet. Add one to start tracking your job search.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #333" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Company</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "10px" }}></th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr
                key={app._id}
                onClick={() => navigate(`/applications/${app._id}`)}
                style={{
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                <td style={{ padding: "10px" }}>
                  {formatDate(app.appliedDate || app.createdAt)}
                </td>

                <td style={{ padding: "10px" }}>{app.company}</td>

                <td style={{ padding: "10px" }}>{app.roleTitle}</td>

                <td style={{ padding: "10px" }}>{app.status}</td>
              </tr>
            ))}
          </tbody>
        
        </table>
      )}
    </main>
  );
};

export default AppList;
