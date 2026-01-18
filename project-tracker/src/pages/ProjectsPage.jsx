import ProjectList from "../components/ProjectList";

export default function ProjectsPage({ projects, onEdit, onDelete }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Projects</h2>
      <ProjectList projects={projects} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "24px auto",
    padding: "0 16px",
  },
  heading: {
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#111827",
  },
};
