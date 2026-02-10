

import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

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
    <main>
      <h1>Create an account</h1>
    <p>Create an account to start tracking your job search.</p>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
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

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
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

        <div>
          <label htmlFor="passwordConf">Confirm Password:</label>
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

        <div>
          <button type="submit" disabled={isFormInvalid()}>
            Sign Up
          </button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
          <p>
            Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;