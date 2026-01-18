export default function ProjectList({ projects, onEdit, onDelete }) {
  return (
    <div style={styles.grid}>
      {projects.map((p) => (
        <div key={p.id} style={styles.card}>
          <div style={styles.header}>
            <h3 style={styles.title}>{p.projectName}</h3>
            <span style={{ ...styles.status, ...statusStyle(p.status) }}>
              {p.status}
            </span>
          </div>

          <div style={styles.body}>
            <p style={styles.text}>
              <strong>ID:</strong> {p.id}
            </p>
            <p style={styles.text}>
              <strong>Description:</strong> {p.description}
            </p>
            <p style={styles.text}>
              <strong>Tech Stack:</strong> {p.techStack}
            </p>
          </div>

          <div style={styles.actions}>
            <button style={styles.editBtn} onClick={() => onEdit(p)}>
              Edit
            </button>
            <button style={styles.deleteBtn} onClick={() => onDelete(p.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Status Color Logic ===== */
const statusStyle = (status) => {
  switch (status) {
    case "Planned":
      return { backgroundColor: "#e0f2fe", color: "#0369a1" };
    case "InProgress":
      return { backgroundColor: "#fef3c7", color: "#92400e" };
    case "Completed":
      return { backgroundColor: "#dcfce7", color: "#166534" };
    default:
      return { backgroundColor: "#e5e7eb", color: "#374151" };
  }
};

/* ===== Industrial Styles ===== */
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  body: {
    marginTop: "8px",
  },
  text: {
    margin: "6px 0",
    fontSize: "14px",
    color: "#374151",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "14px",
  },
  editBtn: {
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: "500",
    borderRadius: "6px",
    border: "1px solid #2563eb",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: "500",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
  },
};
