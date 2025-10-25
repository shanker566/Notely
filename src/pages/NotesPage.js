import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import NoteCard from '../components/NoteCard';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { yearId, subjectId } = useParams(); // Gets year and subject from URL

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        // --- MODIFIED: Select the new 'note_type' column ---
        const { data, error } = await supabase
          .from('notes')
          .select('id, file_name, url, note_type') // <-- Add note_type here
          .eq('year', yearId)
          .eq('subject', subjectId);
        // --- END MODIFICATION ---

        if (error) throw error;
        setNotes(data || []); // Ensure notes is always an array

      } catch (err) {
        console.error(err);
        setError('Failed to fetch notes.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [yearId, subjectId]); // Re-run if year or subject changes

  if (loading) return <h2>Loading notes...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  // --- NEW: Filter notes into categories ---
  const classNotes = notes.filter(note => note.note_type === 'Class Notes' || !note.note_type); // Default to class notes if type is missing
  const labNotes = notes.filter(note => note.note_type === 'Lab Notes');
  // --- END NEW ---

  return (
    <div className="page-wrapper">
      <Link to={`/year/${yearId}`} className="back-link">
        &larr; Back to {yearId} Subjects
      </Link>
      <h1>{subjectId} Notes</h1>

      {/* --- NEW: Render notes grouped by type --- */}
      {notes.length > 0 ? (
        <div>
          {classNotes.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2>Class Notes</h2>
              <div className="card-grid" style={{ gap: '10px' }}> {/* Smaller gap for notes list */}
                {classNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </section>
          )}

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
      {/* --- END NEW --- */}
    </div>
  );
}

export default NotesPage;