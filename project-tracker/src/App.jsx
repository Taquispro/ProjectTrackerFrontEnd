import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "./services/projectService";

function AppContent() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const navigate = useNavigate();

  const loadProjects = async () => {
    const res = await getProjects();
    setProjects(res.data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (deleteProjectId) {
      deleteProject(deleteProjectId).then(loadProjects);
      setDeleteProjectId(null);
    }
  }, [deleteProjectId]);

  const handleSubmit = async (project) => {
    if (selectedProject) {
      await updateProject(project);
      setSelectedProject(null);
    } else {
      await addProject(project);
    }
    loadProjects();
    navigate("/"); // 👈 redirect after submit
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    navigate("/add");
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProjectsPage
              projects={projects}
              onEdit={handleEdit}
              onDelete={setDeleteProjectId}
            />
          }
        />
        <Route
          path="/add"
          element={
            <ProjectFormPage
              onSubmit={handleSubmit}
              selectedProject={selectedProject}
            />
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
