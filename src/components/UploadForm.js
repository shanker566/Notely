import React, { useState } from 'react';
import { supabase } from '../supabase/supabase';

function UploadForm() {
  // Store multiple files in an array
  const [files, setFiles] = useState([]); 
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  // Track progress and messages for multiple files
  const [uploadStatus, setUploadStatus] = useState({ progress: 0, messages: [] }); 

  // Handle multiple files selected
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files)); // Convert FileList to Array
    } else {
      setFiles([]);
    }
  };

  // Upload a single file and return its status
  const uploadSingleFile = async (file) => {
    try {
      const filePath = `public/${year}/${subject}/${file.name}`;
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
        });

      if (dbError) throw dbError;

      return { success: true, fileName: file.name, message: 'Uploaded successfully!' };
    } catch (error) {
      console.error(`Error uploading ${file.name}: `, error);
      return { success: false, fileName: file.name, message: `Error: ${error.message}` };
    }
  };

  // Handle form submission for multiple files
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 || !year || !subject) {
      setUploadStatus({ progress: 0, messages: ['Please fill in Year, Subject, and select one or more files.'] });
      return;
    }

    setLoading(true);
    setUploadStatus({ progress: 0, messages: [`Starting upload of ${files.length} files...`] });

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadSingleFile(file);
      results.push(result);
      // Update progress
      setUploadStatus(prevStatus => ({
        progress: ((i + 1) / files.length) * 100,
        messages: [...prevStatus.messages, `${result.fileName}: ${result.message}`]
      }));
    }

    // Reset form after all uploads are done
    setFiles([]);
    setYear('');
    setSubject('');
    setLoading(false);
    // Keep the final messages
    setUploadStatus(prevStatus => ({ ...prevStatus, progress: 100 })); 
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h3>Upload New Note(s)</h3>
      <div>
        <label>Year: </label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g., Y23"
          required // Make fields required
        />
      </div>
      <div>
        <label>Subject: </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Mathematics"
          required // Make fields required
        />
      </div>
      <div>
        <label>File(s) (PDF, PPT, PPTX): </label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf,.ppt,.pptx"
          multiple // <-- ALLOW MULTIPLE FILES
          required // Make file selection required
        />
      </div>
      
      {/* Show progress bar during upload */}
      {loading && (
        <div style={{ marginTop: '1rem' }}>
          <progress value={uploadStatus.progress} max="100" style={{ width: '100%' }} />
          <p>{Math.round(uploadStatus.progress)}% Complete</p>
        </div>
      )}

      <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? `Uploading (${files.length} files)...` : `Upload (${files.length} files)`}
      </button>

      {/* Display messages for each file */}
      {uploadStatus.messages.length > 0 && (
        <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
          <h4>Upload Status:</h4>
          {uploadStatus.messages.map((msg, index) => (
            <p key={index} style={{ color: msg.includes('Error') ? 'red' : 'inherit', fontSize: '0.9em' }}>{msg}</p>
          ))}
        </div>
      )}
    </form>
  );
}

export default UploadForm;