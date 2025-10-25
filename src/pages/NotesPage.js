import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import NoteCard from '../components/NoteCard';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { yearId, subjectId } = useParams(); 

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        // --- MODIFIED: Select the new 'course_outcome' column ---
        const { data, error } = await supabase
          .from('notes')
          // Select all needed columns
          .select('id, file_name, url, note_type, course_outcome') 
          .eq('year', yearId)
          .eq('subject', subjectId);
        // --- END MODIFICATION ---

        if (error) throw error;
        setNotes(data || []); 

      } catch (err) {
        console.error(err);
        setError('Failed to fetch notes.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [yearId, subjectId]); 

  if (loading) return <h2>Loading notes...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  // --- MODIFIED: Group notes by type AND course outcome ---
  const labNotes = notes.filter(note => note.note_type === 'Lab Notes');
  
  // Group Class Notes by Course Outcome
  const classNotesGrouped = notes
    .filter(note => note.note_type === 'Class Notes' || !note.note_type) // Include notes without a type yet
    .reduce((acc, note) => {
      const co = note.course_outcome || 'Uncategorized'; // Group notes without CO under 'Uncategorized'
      if (!acc[co]) {
        acc[co] = [];
      }
      acc[co].push(note);
      return acc;
    }, {});
    
  // Get sorted CO keys (e.g., CO1, CO2, Uncategorized)
  const coKeys = Object.keys(classNotesGrouped).sort(); 
  // --- END MODIFICATION ---

  return (
    <div className="page-wrapper">
      <Link to={`/year/${yearId}`} className="back-link">
        &larr; Back to {yearId} Subjects
      </Link>
      <h1>{subjectId} Notes</h1>

      {notes.length > 0 ? (
        <div>
          {/* --- MODIFIED: Render Class Notes grouped by CO --- */}
          {coKeys.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2>Class Notes</h2>
              {coKeys.map(coKey => (
                <div key={coKey} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    {coKey} {/* Display CO unit name */}
                  </h3>
                  <div className="card-grid" style={{ gap: '10px' }}>
                    {classNotesGrouped[coKey].map(note => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
          {/* --- END MODIFICATION --- */}

          {labNotes.length > 0 && (
            <section>
              <h2>Lab Notes</h2>
              <div className="card-grid" style={{ gap: '10px' }}>
                {labNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <p>No notes found for this subject.</p>
      )}
    </div>
  );
}

export default NotesPage;