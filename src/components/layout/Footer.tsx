export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          © {new Date().getFullYear()} Gavin Woodhouse. All rights reserved.
        </span>
        <a
          href="https://www.linkedin.com/in/gavin-woodhouse-514966286/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--accent)",
            fontSize: "0.875rem",
            textDecoration: "none",
          }}
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
