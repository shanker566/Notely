import React, { useState } from 'react';
import { supabase } from '../supabase/supabase';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !year || !subject) {
      setMessage('Please fill in all fields and select a file.');
      return;
    }

    setLoading(true);
    setMessage('Uploading file...');

    try {
      const filePath = `public/${year}/${subject}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('notes')
        .getPublicUrl(filePath);
        
      const publicURL = data.publicUrl;

      const { error: dbError } = await supabase
        .from('notes')
        .insert({
          year: year,
          subject: subject,
          file_name: file.name,
          url: publicURL,
        });

      if (dbError) throw dbError;

      setFile(null);
      setYear('');
      setSubject('');
      setMessage('File uploaded successfully!');
    } catch (error) {
      console.error("Error uploading file: ", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h3>Upload New Note</h3>
      <div>
        <label>Year: </label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g., Y23"
        />
      </div>
      <div>
        <label>Subject: </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Mathematics"
        />
      </div>
      <div>
        <label>File (PDF, PPT, PPTX): </label>
        {/* MODIFIED: Update the accept attribute */}
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf,.ppt,.pptx" // <-- Allow PDF, PPT, and PPTX
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </form>
  );
}

export default UploadForm;