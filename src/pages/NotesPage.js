import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import NoteCard from '../components/NoteCard';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { yearId, subjectId } = useParams(); // Gets 'Y24' and 'Maths' from URL

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        // 1. Fetch all notes matching the year AND subject
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('year', yearId)
          .eq('subject', subjectId);

        if (error) throw error;
        
        setNotes(data);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch notes.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [yearId, subjectId]); // Re-run if these change

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to={`/year/${yearId}`}>&larr; Back to {yearId} Subjects</Link>
      <h1>{yearId} - {subjectId}</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {notes.length > 0 ? (
          notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))
        ) : (
          <p>No notes found for this subject.</p>
        )}
      </div>
    </div>
  );
}

export default NotesPage;
