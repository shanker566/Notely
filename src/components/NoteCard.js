import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. Make sure this is imported

function NoteCard({ note }) {
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    color: '#007bff',
    display: 'block',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  return (
    // 2. This MUST be a <Link> component, not an <a> tag
    <Link 
      to={`/view/${note.id}`} // <-- 3. This links to your new viewer page
      style={cardStyle}
    >
      {note.file_name}
    </Link>
  );
}

export default NoteCard;