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
  setView,
  getView,
} from "./services/projectService";

// Footer styling
const footerStyle = {
  marginTop: "40px",
  padding: "12px 0",
  textAlign: "center",
  fontSize: "14px",
  color: "#6b7280",
  borderTop: "1px solid #e5e7eb",
};

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  // View object state
  const [viewCount, setViewCount] = useState(0);

  const navigate = useNavigate();

  /* -------------------- VIEW COUNT (NO REFRESH) -------------------- */
  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const alreadyCounted = sessionStorage.getItem("viewCounted");

    const updateView = async () => {
      try {
        let res;
        if (navEntry?.type === "navigate" && !alreadyCounted) {
          res = await setView(); // await the POST increment
          sessionStorage.setItem("viewCounted", "true");
        } else {
          res = await getView(); // await the GET
        }

        setViewCount(res.data); // now res.data exists
      } catch (err) {
        console.error("Error updating view count:", err);
      }
    };

    updateView();
  }, []);

  /* -------------------- LOAD PROJECTS -------------------- */
  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* -------------------- DELETE PROJECT -------------------- */
  useEffect(() => {
    if (deleteProjectId) {
      deleteProject(deleteProjectId).then(loadProjects);
      setDeleteProjectId(null);
    }
  }, [deleteProjectId]);

  /* -------------------- ADD / UPDATE -------------------- */
  const handleSubmit = async (project) => {
    if (selectedProject) {
      await updateProject(project);
      setSelectedProject(null);
    } else {
      await addProject(project);
    }
    loadProjects();
    navigate("/");
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    navigate("/add");
  };

  const Loader = () => (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading projects...</p>
    </div>
  );

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            loading ? (
              <Loader />
            ) : (
              <ProjectsPage
                projects={projects}
                onEdit={handleEdit}
                onDelete={setDeleteProjectId}
              />
            )
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

      {/* Footer with view count */}
      <footer style={footerStyle}>
        <span>Views: {viewCount}</span>
      </footer>
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
