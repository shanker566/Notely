import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import PDFViewer from '../components/PDFViewer';

function ViewPage() {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { noteId } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', noteId)
          .single(); 

        if (error) throw error;
        setNote(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch note details.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) return <h2>Loading document...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;
  if (!note) return <h2>Note not found.</h2>;

  return (
    <div className="page-wrapper">
      <Link to={`/notes/${note.year}/${note.subject}`} className="back-link">
        &larr; Back to {note.subject} Notes
      </Link>
      <h2>{note.file_name}</h2>
      
      <PDFViewer fileUrl={note.url} />
    </div>
  );
}

export default ViewPage;
