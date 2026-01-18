import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>Project Tracker</h3>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Projects
        </Link>
        <Link to="/add" style={styles.link}>
          Add Project
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    backgroundColor: "#111827",
    color: "#fff",
  },
  logo: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
};
