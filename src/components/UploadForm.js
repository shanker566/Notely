import React, { useState } from 'react';
import { supabase } from '../supabase/supabase';

function UploadForm() {
  const [files, setFiles] = useState([]); 
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [noteType, setNoteType] = useState('Class Notes'); 
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ progress: 0, messages: [] }); 

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files)); 
    } else {
      setFiles([]);
    }
  };

  const uploadSingleFile = async (file) => {
    try {
      const filePath = `public/${year}/${subject}/${noteType}/${file.name}`;       
      const { error: uploadError } = await supabase.storage
        .from('notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('notes')
        .getPublicUrl(filePath);
        
      const publicURL = urlData.publicUrl;

      const { error: dbError } = await supabase
        .from('notes')
        .insert({
          year: year,
          subject: subject,
          file_name: file.name,
          url: publicURL,
          note_type: noteType 
        });

      if (dbError) throw dbError;

      return { success: true, fileName: file.name, message: 'Uploaded successfully!' };
    } catch (error) {
      console.error(`Error uploading ${file.name}: `, error);
      return { success: false, fileName: file.name, message: `Error: ${error.message}` };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 || !year || !subject || !noteType) { 
      setUploadStatus({ progress: 0, messages: ['Please fill in Year, Subject, Note Type, and select file(s).'] });
      return;
    }

    setLoading(true);
    setUploadStatus({ progress: 0, messages: [`Starting upload of ${files.length} files...`] });

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadSingleFile(file);
      results.push(result);
      setUploadStatus(prevStatus => ({
        progress: ((i + 1) / files.length) * 100,
        messages: [...prevStatus.messages, `${result.fileName}: ${result.message}`]
      }));
    }

    setFiles([]);
    // Clear the file input visually (requires accessing the DOM element)
    if (document.getElementById('file-input')) {
        document.getElementById('file-input').value = "";
    }
    setYear('');
    setSubject('');
    setNoteType('Class Notes'); 
    setLoading(false);
    setUploadStatus(prevStatus => ({ ...prevStatus, progress: 100 })); 
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h3>Upload New Note(s)</h3>
      <div>
        <label>Year: </label>
        <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., Y23" required />
      </div>
      <div>
        <label>Subject: </label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Mathematics" required />
      </div>
      
      <div>
        <label>Note Type: </label>
        <select value={noteType} onChange={(e) => setNoteType(e.target.value)} required style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-color)', fontSize: '1rem'}}>
          <option value="Class Notes">Class Notes</option>
          <option value="Lab Notes">Lab Notes</option>
        </select>
      </div>

      <div>
        <label>File(s) (PDF, PPT, PPTX): </label>
        {/* Added id for clearing */}
        <input id="file-input" type="file" onChange={handleFileChange} accept=".pdf,.ppt,.pptx" multiple required />
      </div>
      
      {/* --- CORRECTED JSX --- */}
      {loading && (
        <div style={{ marginTop: '1rem' }}>
          <progress value={uploadStatus.progress} max="100" style={{ width: '100%' }} />
          <p>{Math.round(uploadStatus.progress)}% Complete</p>
        </div>
      )}

      <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? `Uploading ${files.length} file(s)...` : `Upload (${files.length} selected)`}
      </button>

      {uploadStatus.messages.length > 0 && !loading && ( // Show final status only when not loading
        <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
          <h4>Upload Status:</h4>
          {uploadStatus.messages.slice(1).map((msg, index) => ( // slice(1) to skip the "Starting upload..." message
            <p key={index} style={{ color: msg.includes('Error:') ? 'red' : 'inherit', fontSize: '0.9em' }}>{msg}</p>
          ))}
        </div>
      )}
      {/* --- END CORRECTION --- */}
    </form>
  );
}

export default UploadForm;