import React from 'react';
import { supabase } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

function AdminPage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="page-wrapper">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      <button onClick={handleSignOut}>
        Sign Out
      </button>

      <hr style={{ margin: '2rem 0', borderColor: '#333' }} />
      
      <UploadForm />
    </div>
  );
}

export default AdminPage;
