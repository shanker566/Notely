import React from 'react';
import { Link } from 'react-router-dom';

function NoteCard({ note }) {
  const isPdf = note.file_name.toLowerCase().endsWith('.pdf');

  // Common styling
  const cardStyle = "note-card"; // Use class from App.css

  // If it's a PDF, link to the internal viewer page
  if (isPdf) {
    return (
      <Link 
        to={`/view/${note.id}`} 
        className={cardStyle}
      >
        📄 {note.file_name} (View)
      </Link>
    );
  } else {
    // If it's not a PDF (PPT/PPTX), link directly to the file for download
    return (
      <a 
        href={note.url} 
        className={cardStyle}
        target="_blank" // Open in new tab might trigger download
        rel="noopener noreferrer"
        download // Suggest downloading
      >
        📎 {note.file_name} (Download)
      </a>
    );
  }
}

export default NoteCard;