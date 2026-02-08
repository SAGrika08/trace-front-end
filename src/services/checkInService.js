const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/applications`;

const create = async (appId, checkInData) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/check-ins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(checkInData),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const getCheckIns = async (appId) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/check-ins`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (appId, checkInId, checkInData) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/check-ins/${checkInId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(checkInData),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteCheckIn = async (appId, checkInId) => {
  try {
    const res = await fetch(`${BASE_URL}/${appId}/check-ins/${checkInId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export { create, getCheckIns, update, deleteCheckIn };
