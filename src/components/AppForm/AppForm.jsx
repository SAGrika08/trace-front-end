import { useState } from "react";
import { useNavigate } from "react-router";
import * as appService from "../../services/appService";

const AppForm = (props) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    roleTitle: "",
    industry: "other",
    status: "applied",
    appliedDate: "",      
    location: "",
    salaryRange: "",
    furtherDetails: "",
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  
 const handleSubmit = (evt) => {
  evt.preventDefault();

  const payload = {
    ...formData,
    appliedDate: formData.appliedDate || undefined,
  };

  props.handleAddApp(payload);
};

  return (
    <main>
      <h1>Add Application</h1>
      <p>
    Add a role you’re applying to so you can keep everything in one place. Fill in what you know now,
    you can always come back later to update details, add follow-ups, or change the status.
    </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="company-input">Company</label>
        <input
          required
          type="text"
          name="company"
          id="company-input"
          value={formData.company}
          onChange={handleChange}
        />

        <label htmlFor="roleTitle-input">Role Title</label>
        <input
          required
          type="text"
          name="roleTitle"
          id="roleTitle-input"
          value={formData.roleTitle}
          onChange={handleChange}
        />

        <label htmlFor="industry-input">Industry</label>
        <select
          name="industry"
          id="industry-input"
          value={formData.industry}
          onChange={handleChange}
        >
          <option value="tech">tech</option>
          <option value="fintech">fintech</option>
          <option value="medtech">medtech</option>
          <option value="edtech">edtech</option>
          <option value="ecom">ecom</option>
          <option value="media">media</option>
          <option value="startup">startup</option>
          <option value="other">other</option>
        </select>

        <label htmlFor="status-input">Status</label>
        <select
          name="status"
          id="status-input"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="applied">applied</option>
          <option value="working">working</option>
          <option value="interviewing">interviewing</option>
          <option value="offer">offer</option>
          <option value="rejected">rejected</option>
          <option value="withdrawn">withdrawn</option>
          <option value="bookmark">bookmark</option>
        </select>

        <label htmlFor="appliedDate-input">Applied Date</label>
        <input
          type="date"
          name="appliedDate"
          id="appliedDate-input"
          value={formData.appliedDate}
          onChange={handleChange}
        />

        <label htmlFor="location-input">Location</label>
        <input
          type="text"
          name="location"
          id="location-input"
          value={formData.location}
          onChange={handleChange}
        />

        <label htmlFor="salaryRange-input">Salary Range</label>
        <input
          type="text"
          name="salaryRange"
          id="salaryRange-input"
          value={formData.salaryRange}
          onChange={handleChange}
        />

        <label htmlFor="furtherDetails-input">Further Details</label>
        <textarea
          name="furtherDetails"
          id="furtherDetails-input"
          value={formData.furtherDetails}
          onChange={handleChange}
        />

        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default AppForm;