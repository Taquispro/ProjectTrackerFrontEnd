import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti"; // npm install canvas-confetti

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
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1e3a8a",
  borderTop: "2px solid #3b82f6",
  background: "linear-gradient(90deg, #e0f2fe, #bae6fd)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  position: "relative",
};

// View default
const view = {
  year: 2026,
  view: 0,
};

// Animated Counter Component
function AnimatedView({ count, triggerConfetti }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = count;
    if (start === end) return;

    const step = Math.ceil(end / 60); // 60 steps
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplay(start);
    }, 30); // 30ms interval ~ 1.8s animation

    // Trigger confetti if needed
    if (triggerConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    return () => clearInterval(timer);
  }, [count, triggerConfetti]);

  return (
    <div
      style={{
        fontSize: "22px",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #facc15, #f87171, #3b82f6)",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      👁️ {display.toLocaleString()}
    </div>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [viewCount, setViewCount] = useState(view);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  const navigate = useNavigate();

  // -------------------- VIEW COUNT --------------------
  useEffect(() => {
    const updateView = async () => {
      try {
        const cameFromLink =
          document.referrer &&
          !document.referrer.includes(window.location.hostname);
        const alreadyCounted = localStorage.getItem("viewCounted");

        let res;
        if (!alreadyCounted && cameFromLink) {
          res = await setView(); // increment backend
          localStorage.setItem("viewCounted", "true");
          setTriggerConfetti(true); // trigger confetti for new external visit
        } else {
          res = await getView(); // fetch current view
        }

        setViewCount(res.data);
      } catch (err) {
        console.error("Error updating view count:", err);
      }
    };

    updateView();
  }, []);

  // -------------------- LOAD PROJECTS --------------------
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

  // -------------------- DELETE PROJECT --------------------
  useEffect(() => {
    if (deleteProjectId) {
      deleteProject(deleteProjectId).then(loadProjects);
      setDeleteProjectId(null);
    }
  }, [deleteProjectId]);

  // -------------------- ADD / UPDATE --------------------
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

      {/* Footer with flashy animated view */}
      <footer style={footerStyle}>
        <AnimatedView
          count={viewCount.view}
          triggerConfetti={triggerConfetti}
        />
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
