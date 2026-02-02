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

// --- PURE CSS (Injected via Template Literal) ---
const styleTag = `
  @keyframes count-up {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-success {
    0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
  }
  .view-badge-new {
    animation: pulse-success 1.5s infinite;
    border-color: #2563eb !important;
  }
`;

// --- STYLES ---
const footerStyle = {
  marginTop: "60px",
  padding: "40px 0",
  textAlign: "center",
  borderTop: "1px solid #f1f5f9",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 20px",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  transition: "all 0.4s ease",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const countStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

// --- ANIMATED COUNTER COMPONENT ---
function AnimatedView({ count, isNewVisit }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 50;
    const end = count;

    if (end === 0) return;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(easeOut * end));

      if (frame === totalFrames) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div style={badgeStyle} className={isNewVisit ? "view-badge-new" : ""}>
      <style>{styleTag}</style>
      <span style={labelStyle}>Analytics</span>
      <div style={countStyle}>
        {display.toLocaleString()}{" "}
        <span style={{ fontSize: "12px", color: "#cbd5e1" }}>Views</span>
      </div>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function AppContent() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [viewCount, setViewCount] = useState({ year: 2026, view: 0 });
  const [isNewVisit, setIsNewVisit] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const updateView = async () => {
      try {
        const cameFromLink =
          document.referrer &&
          !document.referrer.includes(window.location.hostname);
        const alreadyCounted = localStorage.getItem("viewCounted");

        let res;
        if (!alreadyCounted && cameFromLink) {
          res = await setView();
          localStorage.setItem("viewCounted", "true");
          setIsNewVisit(true); // Triggers the pulse animation instead of confetti
        } else {
          res = await getView();
        }
        setViewCount(res.data);
      } catch (err) {
        console.error("Error updating view count:", err);
      }
    };
    updateView();
  }, []);

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
    navigate("/");
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    navigate("/add");
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <div className="loading-container">
                  <div className="spinner" />
                </div>
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
      </div>

      <footer style={footerStyle}>
        <AnimatedView count={viewCount.view} isNewVisit={isNewVisit} />
        <div
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            marginTop: "8px",
            fontWeight: "500",
          }}
        >
          &copy; {viewCount.year} Portfolio Management System
        </div>
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
