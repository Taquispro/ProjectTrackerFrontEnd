import axios from "axios";

const API_URL = "https://projecttrackerjar.onrender.com";

export const getProjects = () => {
  let result = axios.get(`${API_URL}/projects`);

  return result;
};

export const addProject = (project) => {
  return axios.post(`${API_URL}/project`, project, {
    headers: { "Content-Type": "application/json" },
  });
};

export const updateProject = (project) => {
  return axios.put(`${API_URL}/project`, project, {
    headers: { "Content-Type": "application/json" },
  });
};
export const deleteProject = (projectid) => {
  return axios.delete(`${API_URL}/project/${projectid}`);
};
