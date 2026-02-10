import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import * as appService from "../../services/appService";

const AppForm = (props) => {
  const navigate = useNavigate();
  const { appId } = useParams();

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

  useEffect(() => {
    const fetchApp = async () => {
      const data = await appService.show(appId);
      const app = data.application || data;
      setFormData({
        company: app.company || "",
        roleTitle: app.roleTitle || "",
        industry: app.industry || "other",
        status: app.status || "applied",
        appliedDate: app.appliedDate ? app.appliedDate.split('T')[0] : "",
        location: app.location || "",
        salaryRange: app.salaryRange || "",
        furtherDetails: app.furtherDetails || "",
      });
    };
    if (appId) fetchApp();

    return () => setFormData({
      company: "",
      roleTitle: "",
      industry: "other",
      status: "applied",
      appliedDate: "",
      location: "",
      salaryRange: "",
      furtherDetails: "",
    });
  }, [appId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  
 const handleSubmit = (evt) => {
  evt.preventDefault();

  const payload = {
    ...formData,
    appliedDate: formData.appliedDate || undefined,
  };

  if (appId) {
    props.handleUpdateApp(appId, payload);
  } else {
    props.handleAddApp(payload);
  }
};

  return (
    <main>
      <h1>{appId ? 'Edit Application' : 'Add Application'}</h1>

    <p className="form-subtext">
  {appId ? (
    <>
      Use this form to update an application.
      <br />
      Change the status, dates, or notes to reflect what’s happened so far.
    </>
  ) : (
    <>
      Use this form to save a job you have applied to or want to keep track of.
      <br />
      You don't need every detail right now, add what you know and update it as things move forward.
    </>
  )}
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

        <button type="submit">{appId ? 'Update' : 'Submit'}</button>
         <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </main>
  );
};

export default AppForm;