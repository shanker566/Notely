import React from 'react';
import { Link } from 'react-router-dom';

function YearCard({ year }) {
  return (
    <Link to={`/year/${year}`} className="card">
      <h2>{year}</h2>
      <p>View Subjects</p>
    </Link>
  );
}

export default YearCard;
