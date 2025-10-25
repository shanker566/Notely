import React from 'react';

function Footer() {
  const myEmail = "2400080042@kluniversity.in";
  const myLinkedIn = "https://www.linkedin.com/in/gowrishanker-bhonagiri-552362360";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
        
        {/* Email Link */}
        <span style={{ marginRight: '10px' }}>
          <span role="img" aria-label="email" style={{ marginRight: '5px' }}>
            ✉️
          </span>
          <a 
            href={`mailto:${myEmail}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {myEmail}
          </a>
        </span>
        
        <span style={{ margin: '0 10px', color: '#888' }}>|</span>

        {/* LinkedIn Link */}
        <span style={{ marginLeft: '10px' }}>
          <span role="img" aria-label="linkedin" style={{ marginRight: '5px' }}>
            💼
          </span>
          <a 
            href={myLinkedIn}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn Profile
          </a>
        </span>
      </div>
      <p style={{ fontSize: '0.8rem' }}>&copy; {currentYear} Notely App. All rights reserved.</p>
    </footer>
  );
}

export default Footer;