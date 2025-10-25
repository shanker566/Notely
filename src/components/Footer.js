import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation

function Footer() {
  const myEmail = "2400080042@kluniversity.in";
  const myLinkedIn = "https://www.linkedin.com/in/gowrishanker-bhonagiri-552362360";
  // IMPORTANT: Replace this with your actual GitHub profile URL
  const myGitHub = "https://github.com/your-github-username"; 
  const currentYear = new Date().getFullYear();

  // Reusable style for links (keeping minimal inline styles for margin)
  const linkMarginStyle = { margin: "0 5px" };
  const separatorStyle = { margin: "0 10px", color: "var(--text-color-light)" }; // Use CSS variable

  return (
    <footer className="footer"> {/* Use class from App.css */}
      
      {/* Top section - Quick links (Using '#' for placeholders) */}
      <div className="footer-links" style={{ marginBottom: "10px" }}>
        <Link to="/" style={linkMarginStyle}>Home</Link> |
        <a href="#" style={linkMarginStyle}>About</a> | {/* Placeholder */}
        <a href="#" style={linkMarginStyle}>Projects</a> | {/* Placeholder */}
        <a href="#" style={linkMarginStyle}>Contact</a> {/* Placeholder */}
      </div>

      {/* Middle section - Contact info */}
      <div className="footer-contact" style={{ marginBottom: "10px" }}>
        <span>
          ✉️ <a href={`mailto:${myEmail}`} target="_blank" rel="noopener noreferrer" style={linkMarginStyle}>{myEmail}</a>
        </span>
        <span style={separatorStyle}>|</span>
        <span>
          💼 <a href={myLinkedIn} target="_blank" rel="noopener noreferrer" style={linkMarginStyle}>LinkedIn</a>
        </span>
        <span style={separatorStyle}>|</span>
        <span>
          🧑‍💻 <a href={myGitHub} target="_blank" rel="noopener noreferrer" style={linkMarginStyle}>GitHub</a>
        </span>
      </div>

      {/* Tagline / Credit */}
      <p className="footer-tagline" style={{ margin: "5px 0" }}>
        Built with ❤️ using React by <strong>Gowrishanker Bhonagiri</strong>, KL University
      </p>

      {/* Legal + Year */}
      <p className="footer-legal">
        &copy; {currentYear} Notely App. All rights reserved. | 
        <a href="#" style={linkMarginStyle}> Privacy Policy</a> | {/* Placeholder */}
        <a href="#" style={linkMarginStyle}> Terms of Use</a> {/* Placeholder */}
      </p>

      {/* Removed "Back to Top" for simplicity for now */}
      
    </footer>
  );
}

export default Footer;