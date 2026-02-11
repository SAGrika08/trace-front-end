

import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import LogoV from '../../assets/images/logo-v.svg';
import styles from './SignUpForm.module.css';

const SignUpForm = () => {
  const navigate = useNavigate();

    const { setUser } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
  });

  const { username, email, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
  evt.preventDefault();
  try {
    const payload = {
      username,
      password,
      passwordConf,
      ...(email && { email }),
    };
    const newUser = await signUp(payload);
    setUser(newUser);
    navigate("/");
  } catch (err) {
    setMessage(err.message);
  }
};

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.brand}>
          <img src={LogoV} alt="Trace logo" className={styles.logo} />
        </div>

        <section className={styles.card}>
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtext}>Create an account to start tracking your job search.</p>

          {message && <p className={styles.error}>{message}</p>}

          <form className={styles.form} autoComplete="off" onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="your username"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="passwordConf">Confirm password</label>
              <input
                type="password"
                id="passwordConf"
                name="passwordConf"
                value={passwordConf}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" disabled={isFormInvalid()}>
                Sign Up
              </button>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => navigate("/")}
              >
                Cancel
              </button>

              <p className={styles.helper}>
                Already have an account? <Link to="/sign-in">Sign in</Link>
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignUpForm;