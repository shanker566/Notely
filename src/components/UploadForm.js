import React, { useState } from 'react';
import { supabase } from '../supabase/supabase';

function UploadForm() {
  const [files, setFiles] = useState([]); 
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [noteType, setNoteType] = useState('Class Notes'); 
  const [courseOutcome, setCourseOutcome] = useState(''); 
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
      let coPathPart = '';
      if (noteType === 'Class Notes' && courseOutcome) {
          coPathPart = `${courseOutcome}/`; 
      }
      const filePath = `public/${year}/${subject}/${noteType}/${coPathPart}${file.name}`; 
      
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
          note_type: noteType, 
          course_outcome: (noteType === 'Class Notes' && courseOutcome) ? courseOutcome : null 
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
    let validationError = false;
    if (noteType === 'Class Notes' && !courseOutcome) {
        validationError = true;
    }
    if (files.length === 0 || !year || !subject || !noteType || validationError) { 
        let errorMsg = 'Please fill in Year, Subject, Note Type, and select file(s).';
        if (validationError) {
            errorMsg = 'Please fill in Year, Subject, Note Type, Course Outcome, and select file(s).';
        }
      setUploadStatus({ progress: 0, messages: [errorMsg] });
      return;
    }

    setLoading(true);
    // Clear previous messages before starting new upload
    setUploadStatus({ progress: 0, messages: [`Starting upload of ${files.length} file(s)...`] }); 

    const results = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadSingleFile(file);
        results.push(result);
        // Update status incrementally
        setUploadStatus(prevStatus => ({
            progress: ((i + 1) / files.length) * 100,
            // Add new message, keeping existing ones
            messages: [...prevStatus.messages, `${result.fileName}: ${result.message}`] 
        }));
    }

    // Reset form fields
    setFiles([]);
    if (document.getElementById('file-input')) document.getElementById('file-input').value = "";
    setYear('');
    setSubject('');
    setNoteType('Class Notes'); 
    setCourseOutcome(''); 
    setLoading(false); 
    // Keep progress at 100, but allow status messages to show by setting loading to false
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

      {noteType === 'Class Notes' && (
        <div>
          <label>Course Outcome (CO): </label>
          <input 
            type="text" 
            value={courseOutcome} 
            onChange={(e) => setCourseOutcome(e.target.value)} 
            placeholder="e.g., CO1, CO2" 
            required 
            style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-color)', fontSize: '1rem'}} // Added styles
          />
        </div>
      )}

      <div>
        <label>File(s) (PDF, PPT, PPTX): </label>
        <input id="file-input" type="file" onChange={handleFileChange} accept=".pdf,.ppt,.pptx" multiple required />
      </div>
      
      {/* --- CORRECTED JSX FOR FEEDBACK --- */}
      {/* Progress Bar - Show only during loading */}
      {loading && (
        <div style={{ marginTop: '1rem' }}>
          <progress value={uploadStatus.progress} max="100" style={{ width: '100%' }} />
          <p>{Math.round(uploadStatus.progress)}% Complete</p>
        </div>
      )}

      {/* Upload Button - Text changes based on loading state */}
      <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? `Uploading ${files.length} file(s)...` : `Upload (${files.length > 0 ? files.length : 0} selected)`}
      </button>

      {/* Status Box - Show final messages only AFTER loading is false */}
      {uploadStatus.messages.length > 0 && !loading && ( 
        <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}>
          <h4>Upload Status:</h4>
          {/* Skip the initial "Starting upload..." message */}
          {uploadStatus.messages.slice(1).map((msg, index) => ( 
            <p key={index} style={{ color: msg.includes('Error:') ? 'red' : 'inherit', fontSize: '0.9em', marginBottom: '0.2em' }}>{msg}</p>
          ))}
        </div>
      )}
      {/* --- END CORRECTION --- */}
    </form>
  );
}

export default UploadForm;