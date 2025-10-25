import React from 'react';
import { supabase } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }
      
      navigate('/admin');

    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Admin Login</h1>
      <p>Please sign in with your Google account to manage content.</p>
      <br />
      <button onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}

export default AdminLogin;
