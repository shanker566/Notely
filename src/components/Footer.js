import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation

function Footer() {
  // Store emails separately
  const primaryEmail = "2400080042@kluniversity.in";
  const secondaryEmail = "2400030629@kluniversity.in";
  
  const myLinkedIn = "https://www.linkedin.com/in/gowrishanker-bhonagiri-552362360";
  const myGitHub = "https://github.com/shanker566"; // Corrected GitHub link
  const currentYear = new Date().getFullYear();

  // Reusable style for links
  const linkMarginStyle = { margin: "0 5px" };
  const separatorStyle = { margin: "0 10px", color: "var(--text-color-light)" };

  return (
    <footer className="footer"> 
      
      {/* Top section - Quick links */}
      <div className="footer-links" style={{ marginBottom: "10px" }}>
        <Link to="/" style={linkMarginStyle}>Home</Link> |
        <a href="#" style={linkMarginStyle}>About</a> | 
        <a href="#" style={linkMarginStyle}>Projects</a> | 
        <a href="#" style={linkMarginStyle}>Contact</a> 
      </div>

      {/* Middle section - Contact info */}
      <div className="footer-contact" style={{ marginBottom: "10px" }}>
        <span>
          ✉️ 
          {/* Link primarily to the first email, display both */}
          <a href={`mailto:${primaryEmail}`} target="_blank" rel="noopener noreferrer" style={linkMarginStyle}>
            {primaryEmail}
          </a> 
          {secondaryEmail && `, ${secondaryEmail}`} {/* Display second email if it exists */}
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
        Built with ❤️ using React by <strong>Gowrishanker Bhonagiri</strong>, AIDS Department student KL University 
      </p>

      {/* Legal + Year */}
      <p className="footer-legal">
        &copy; {currentYear} Notely App. All rights reserved to owner. | 
        <a href="#" style={linkMarginStyle}> Privacy Policy</a> | 
        <a href="#" style={linkMarginStyle}> Terms of Use</a> 
      </p>
      
    </footer>
  );
}

export default Footer;