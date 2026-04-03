export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-meta">
          <strong>Gavin Woodhouse</strong>
          <span className="footer-copy">
            Strategic advisory for business owners navigating complexity,
            reputational pressure, and recovery.
          </span>
          <span className="footer-copy">
            © {new Date().getFullYear()} Gavin Woodhouse. All rights reserved.
          </span>
        </div>
        <a
          href="https://www.linkedin.com/in/gavin-woodhouse-514966286/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
