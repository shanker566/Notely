import React from 'react';
import { Link } from 'react-router-dom';

function SubjectCard({ subject, year }) {
  return (
    <Link to={`/notes/${year}/${subject}`} className="card">
      <h2>{subject}</h2>
      <p>View Notes</p>
    </Link>
  );
}

export default SubjectCard;
