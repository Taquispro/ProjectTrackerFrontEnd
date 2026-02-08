import { useEffect, useState, useRef } from "react";
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
  searchResult,
} from "./services/projectService";

/* ------------------ VIEW COUNTER ------------------ */

function AnimatedView({ count }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!count) return;

    let frame = 0;
    const totalFrames = 60;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * count));

      if (frame === totalFrames) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div style={{ fontWeight: "bold", fontSize: "16px" }}>
      👀 {display.toLocaleString()} views
    </div>
  );
}

/* ------------------ APP CONTENT ------------------ */

function AppContent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // 🔥 MASTER LIST (always has ID)
  const [projects, setProjects] = useState([]);

  // 🔥 DISPLAY LIST (search or normal)
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  const [viewCount, setViewCount] = useState(null);

  const hasRun = useRef(false);

  /* ------------------ VIEW COUNT ------------------ */

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const trackView = async () => {
      try {
        const visited = sessionStorage.getItem("hasVisitedTab");
        const res = visited ? await getView() : await setView();
        sessionStorage.setItem("hasVisitedTab", "true");
        setViewCount(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    trackView();
  }, []);

  /* ------------------ LOAD PROJECTS ------------------ */

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data);               // master list
      setFilteredProjects(res.data);       // visible list
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ------------------ DELETE ------------------ */

  useEffect(() => {
    if (!deleteProjectId) return;

    deleteProject(deleteProjectId).then(loadProjects);
    setDeleteProjectId(null);
  }, [deleteProjectId]);

  /* ------------------ SEARCH (NO BACKEND CHANGE) ------------------ */

  const handleSearchChange = async (e) => {
    const text = e.target.value;

    if (!text.trim()) {
      setFilteredProjects(projects);
      return;
    }

    try {
      const res = await searchResult(text);

      // 🔥 MERGE ID FROM MASTER LIST
      const withIds = res.data.map((sr) => {
        const full = projects.find(
          (p) =>
            p.projectName === sr.projectName &&
            p.description === sr.description
        );

        return {
          ...sr,
          id: full?.id, // ✅ ID restored
        };
      });

      setFilteredProjects(withIds);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  /* ------------------ FORM ------------------ */

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
    if (!project.id) return alert("Project ID missing");
    setSelectedProject(project);
    navigate("/add");
  };

  /* ------------------ RENDER ------------------ */

  return (
    <>
      <Navbar searchBox={handleSearchChange} />

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  Loading projects...
                </div>
              ) : (
                <ProjectsPage
                  projects={filteredProjects}
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
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          borderTop: "1px solid #ddd",
        }}
      >
        {viewCount && <AnimatedView count={viewCount.view} />}
        <p style={{ fontSize: "12px", color: "#777" }}>
          © {viewCount?.year || new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}

/* ------------------ ROOT ------------------ */

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
