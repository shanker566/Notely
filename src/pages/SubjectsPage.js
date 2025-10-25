import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import SubjectCard from '../components/SubjectCard';

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { yearId } = useParams();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notes')
          .select('subject')
          .eq('year', yearId); 

        if (error) throw error;

        const uniqueSubjects = [...new Set(data.map(note => note.subject))];
        setSubjects(uniqueSubjects);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch subjects.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [yearId]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div className="page-wrapper">
      <Link to="/" className="back-link">&larr; Back to Years</Link>
      <h1>{yearId} Subjects</h1>
      <div className="card-grid">
        {subjects.length > 0 ? (
          subjects.map(subject => (
            <SubjectCard 
              key={subject} 
              subject={subject} 
              year={yearId} 
            />
          ))
        ) : (
          <p>No subjects found for this year.</p>
        )}
      </div>
    </div>
  );
}

export default SubjectsPage;
