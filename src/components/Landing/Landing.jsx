import { Link } from "react-router";

const Landing = () => {
  return (
    <main>
      <h1>Trace</h1>

     <p className="tagline">
        A simple way to organize your job search, from applications to follow-ups and check-ins, so you always know where things stand and what to do next.
      </p>

      <section>
        <h2>How it works</h2>

        <div>
          <h3>Applications</h3>
          <p>Log each job application with the company and role.
            Keep all your applications in one place and update the status as things change.</p>
        </div>

        <div>
          <h3>Follow-ups</h3>
          <p>Set follow-ups for emails, calls, or messages you plan to send.
        Each follow-up has a due date, help to keep track when to reach out next.</p>
        </div>

        <div>
          <h3>Check-ins</h3>
          <p>Once you start working, add short check-ins over time.
            Use them to note how the role is going and reflect on what’s working.</p>
        </div>
      </section>

      <div>
        <Link to="/sign-up">
          <button>Get Started</button>
        </Link>

        <p>
          Already have an account?{" "}
          <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Landing;