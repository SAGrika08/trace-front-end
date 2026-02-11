import { Link } from "react-router";
import styles from './Landing.module.css';
import Logotype from '../../assets/images/logo-h.svg';

const Landing = () => {
  return (
    <>
      <main className={styles.container}>
        <section className={styles.splash}>
          <img src={Logotype} alt='Trace logo' />
        </section>

        <section className={styles.about}>
          <header>
            <h3>HOW IT WORKS</h3>
            <h1>FEATURES</h1>
          </header>
          <article className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Applications</h3>
              <p>Log each job application with the company and role. 
              Keep everything in one place and update the status as things change.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Follow-ups</h3>
              <p>Set follow-ups for emails, calls, or messages you plan to send. 
              Each follow-up has a due date to help you stay on track.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Check-ins</h3>
              <p>Once you start working, add short check-ins over time. 
              Use them to note how the role is going and reflect on what's working.</p>
            </div>
          </article>
        </section>

        <section>
          <Link to="/sign-up">
            <button>Get Started</button>
          </Link>

          <p>
            Already have an account?{" "}
            <Link to="/sign-in">Sign in</Link>
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        © 2025 TRACE. ALL RIGHTS RESERVED
      </footer>
    </>
  );
};

export default Landing;
