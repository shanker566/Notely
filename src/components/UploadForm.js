import React, { useState } from 'react';
import { supabase } from '../supabase/supabase';

function UploadForm() {
  const [files, setFiles] = useState([]); 
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [noteType, setNoteType] = useState('Class Notes'); 
  // --- NEW STATE for Course Outcome ---
  const [courseOutcome, setCourseOutcome] = useState(''); // Store CO unit (CO1, etc.)
  // --- END NEW STATE ---
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ progress: 0, messages: [] }); 

  const handleFileChange = (e) => {
    // ... (keep existing code) ...
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files)); 
    } else {
      setFiles([]);
    }
  };

  const uploadSingleFile = async (file) => {
    try {
      // --- MODIFIED: Include Course Outcome in path if it's Class Notes ---
      let coPathPart = '';
      if (noteType === 'Class Notes' && courseOutcome) {
          coPathPart = `${courseOutcome}/`; // Add CO folder like CO1/
      }
      // Example path: public/Y24/Maths/Class Notes/CO1/lecture1.pdf 
      // Example path: public/Y24/Maths/Lab Notes/lab1.pdf (no CO path)
      const filePath = `public/${year}/${subject}/${noteType}/${coPathPart}${file.name}`; 
      // --- END MODIFICATION ---
      
      const { error: uploadError } = await supabase.storage
        .from('notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('notes')
        .getPublicUrl(filePath);
        
      const publicURL = urlData.publicUrl;

      // --- MODIFIED: Add course_outcome to the database insert ---
      const { error: dbError } = await supabase
        .from('notes')
        .insert({
          year: year,
          subject: subject,
          file_name: file.name,
          url: publicURL,
          note_type: noteType, 
          // Only add course_outcome if it's Class Notes and has a value
          course_outcome: (noteType === 'Class Notes' && courseOutcome) ? courseOutcome : null 
        });
      // --- END MODIFICATION ---

      if (dbError) throw dbError;

      return { success: true, fileName: file.name, message: 'Uploaded successfully!' };
    } catch (error) {
      console.error(`Error uploading ${file.name}: `, error);
      return { success: false, fileName: file.name, message: `Error: ${error.message}` };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- MODIFIED: Add Course Outcome validation only if Class Notes is selected ---
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
    // --- END MODIFICATION ---

    setLoading(true);
    setUploadStatus({ progress: 0, messages: [`Starting upload of ${files.length} files...`] });

    const results = [];
    for (let i = 0; i < files.length; i++) {
        // ... (keep existing loop code) ...
        const file = files[i];
        const result = await uploadSingleFile(file);
        results.push(result);
        setUploadStatus(prevStatus => ({
            progress: ((i + 1) / files.length) * 100,
            messages: [...prevStatus.messages, `${result.fileName}: ${result.message}`]
        }));
    }

    setFiles([]);
    if (document.getElementById('file-input')) document.getElementById('file-input').value = "";
    setYear('');
    setSubject('');
    setNoteType('Class Notes'); 
    setCourseOutcome(''); // Reset course outcome
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
        <select value={noteType} onChange={(e) => setNoteType(e.target.value)} required style={{/* Styles */}}>
          <option value="Class Notes">Class Notes</option>
          <option value="Lab Notes">Lab Notes</option>
        </select>
      </div>

      {/* --- NEW INPUT for Course Outcome (Conditional) --- */}
      {noteType === 'Class Notes' && (
        <div>
          <label>Course Outcome (CO): </label>
          <input 
            type="text" 
            value={courseOutcome} 
            onChange={(e) => setCourseOutcome(e.target.value)} 
            placeholder="e.g., CO1, CO2" 
            required // Make it required only when shown
            style={{/* Styles - copy from other inputs */}}
          />
        </div>
      )}
      {/* --- END NEW INPUT --- */}

      <div>
        <label>File(s) (PDF, PPT, PPTX): </label>
        <input id="file-input" type="file" onChange={handleFileChange} accept=".pdf,.ppt,.pptx" multiple required />
      </div>
      
      {/* Progress Bar */}
      {loading && ( <div style={{ marginTop: '1rem' }}> {/* ... */} </div> )}

      {/* Upload Button */}
      <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>{/* ... */}</button>

      {/* Status Box */}
      {uploadStatus.messages.length > 0 && !loading && ( <div style={{ marginTop: '1rem', /* ... */ }}> {/* ... */} </div> )}
    </form>
  );
}

export default UploadForm;