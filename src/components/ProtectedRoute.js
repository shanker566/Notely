import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase';

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Cleanup the listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  //  ***** THIS IS THE NEW DEBUG LINE *****
  console.log('Loading:', loading, 'Session:', session);

  if (loading) {
    // We are still waiting to hear from Supabase
    return <h1>Loading...</h1>;
  }

  if (!session) {
    // If not loading and no user, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, show the page
  return children;
}

export default ProtectedRoute;