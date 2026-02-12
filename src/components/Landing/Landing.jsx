import { Link } from "react-router";
import styles from "./Landing.module.css";
import Logotype from "../../assets/images/logo-h.svg";
import { ClipboardList, CheckSquare, LineChart } from "lucide-react";

const Landing = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <img className={styles.logo} src={Logotype} alt="Trace logo" />

        <h1 className={styles.headline}>Your job search, organized.</h1>

        <p className={styles.lead}>
          Save every application,  stay on top of follow-ups, and log check-ins
          once you’re working so you always know what to do next.
        </p>

        <div className={styles.heroActions}>
          <Link to="/sign-up" className={styles.linkReset}>
            <button type="button" className={styles.primaryCta}>
              Get Started
            </button>
          </Link>

          <p className={styles.helper}>
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </p>
        </div>
      </section>

      <section className={`${styles.card} ${styles.howCard}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>HOW IT WORKS</p>
          <h2 className={styles.sectionTitle}>Three simple steps</h2>
        </div>

        <div className={styles.howGrid}>
          <article className={styles.howItem}>
            <ClipboardList className={styles.howIcon} />
            <div className={styles.howText}>
              <h3 className={styles.howTitle}>Applications</h3>
              <p className={styles.howBody}>
                Log each application with company and role, track status, everything in one place.
              </p>
            </div>
          </article>

          <div className={styles.divider} />

          <article className={styles.howItem}>
            <CheckSquare className={styles.howIcon} />
            <div className={styles.howText}>
              <h3 className={styles.howTitle}>Follow-ups</h3>
              <p className={styles.howBody}>
                Add reminders for messages and emails, and stay on top of due dates.
              </p>
            </div>
          </article>

          <div className={styles.divider} />

          <article className={styles.howItem}>
            <LineChart className={styles.howIcon} />
            <div className={styles.howText}>
              <h3 className={styles.howTitle}>Check-ins</h3>
              <p className={styles.howBody}>
                Once you start working, log quick notes to reflect and improve over time.
              </p>
            </div>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        © 2026 TRACE. ALL RIGHTS RESERVED
      </footer>
    </main>
  );
};

export default Landing;
