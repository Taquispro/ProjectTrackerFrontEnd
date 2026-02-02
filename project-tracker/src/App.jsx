import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

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

// --- PROFESSIONAL STYLES ---
const footerStyle = {
  marginTop: "60px",
  padding: "32px 0",
  textAlign: "center",
  borderTop: "1px solid #e2e8f0", // Subtle light border
  backgroundColor: "#f8fafc", // Soft slate background
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 16px",
  borderRadius: "99px",
  backgroundColor: "#ffffff",
  border: "1px solid #cbd5e1",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  transition: "all 0.3s ease",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const countStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#2563eb", // Professional Blue
  fontFamily: "Monaco, Consolas, monospace", // Monospace for stable numbers
};

// --- ANIMATED COUNTER COMPONENT ---
function AnimatedView({ count, triggerConfetti }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 60; // ~1 second at 60fps
    const end = count;

    if (end === 0) return;

    const timer = setInterval(() => {
      frame++;
      // Cubic Ease-Out: Starts fast, slows down at the end
      const progress = frame / totalFrames;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDisplay(Math.floor(easeOut * end));

      if (frame === totalFrames) clearInterval(timer);
    }, 16); // ~60fps

    if (triggerConfetti) {
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#3b82f6", "#1d4ed8", "#93c5fd"], // Blue themed
      });
    }

    return () => clearInterval(timer);
  }, [count, triggerConfetti]);

  return (
    <div style={badgeStyle}>
      <span style={labelStyle}>Live Views</span>
      <div style={countStyle}>{display.toLocaleString()}</div>
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
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  const navigate = useNavigate();

  // Logic remains identical to your original code
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
          setTriggerConfetti(true);
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
        <AnimatedView
          count={viewCount.view}
          triggerConfetti={triggerConfetti}
        />
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
          © {viewCount.year} Project Portfolio
        </p>
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
