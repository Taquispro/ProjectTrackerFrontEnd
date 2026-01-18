import { useState, useEffect } from "react";

const emptyProject = {
  id: "",
  projectName: "",
  description: "",
  status: "",
  techStack: "",
};

export default function ProjectForm({ onSubmit, selectedProject }) {
  const [project, setProject] = useState(emptyProject);

  useEffect(() => {
    if (selectedProject) setProject(selectedProject);
  }, [selectedProject]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(project);
    setProject(emptyProject);
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>
        {selectedProject ? "Edit Project" : "Add New Project"}
      </h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Project ID</label>
          <input
            name="id"
            placeholder="Enter project ID"
            value={project.id}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Project Name</label>
          <input
            name="projectName"
            placeholder="Enter project name"
            value={project.projectName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            rows="4"
            placeholder="Describe the project"
            value={project.description}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* ✅ STATUS RADIO BUTTONS */}
        <div style={styles.field}>
          <label style={styles.label}>Status</label>
          <div style={styles.radioGroup}>
            {["Planned", "InProgress", "Completed", "On Hold", "Abandoned"].map(
              (value) => (
                <label key={value} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    checked={project.status === value}
                    onChange={handleChange}
                  />
                  <span style={styles.radioText}>{value}</span>
                </label>
              ),
            )}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Tech Stack</label>
          <input
            name="techStack"
            placeholder="React, Spring Boot, MySQL"
            value={project.techStack}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          {selectedProject ? "Update Project" : "Add Project"}
        </button>
      </form>
    </div>
  );
}

/* ===== Industrial UI Styles ===== */

const styles = {
  card: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
  },
  textarea: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
    resize: "vertical",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
    marginTop: "4px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  radioText: {
    marginLeft: "4px",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
