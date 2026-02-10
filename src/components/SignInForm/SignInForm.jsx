import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";

import { signIn } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
      };

      const signedInUser = await signIn(payload);
      setUser(signedInUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message || "Sign in failed");
    }
  };

  return (
    <main>
      <h1>Sign In</h1>
    <p>Enter your username and password to sign in.</p>
      {message && <p>{message}</p>}

      <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="your username"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <button type="submit">Sign In</button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
          <p>
            Don’t have an account? <Link to="/sign-up">Sign up</Link>
        </p>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;