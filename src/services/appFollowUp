const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/applications`;

const create = async (appId, followUpData) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/follow-ups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(followUpData),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const getFollowUps = async (appId) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/follow-ups`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (appId, followUpId, followUpData) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/follow-ups/${followUpId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(followUpData),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteFollowUp = async (appId, followUpId) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/follow-ups/${followUpId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export { create, getFollowUps, update, deleteFollowUp };