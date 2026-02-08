import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ searchBox }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const text = e.target.value;
    setValue(text);
    searchBox(e); // send event to App.jsx
  };

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>Project Tracker</h3>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search projects..."
        style={styles.input}
      />

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
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #374151",
    outline: "none",
    width: "260px",
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
