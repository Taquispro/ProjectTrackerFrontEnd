import ProjectForm from "../components/ProjectForm";

export default function ProjectFormPage({ onSubmit, selectedProject }) {
  return (
    <div style={styles.container}>
      <ProjectForm onSubmit={onSubmit} selectedProject={selectedProject} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "24px auto",
    padding: "0 16px",
  },
};
