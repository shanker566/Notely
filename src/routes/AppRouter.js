import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SubjectsPage from '../pages/SubjectsPage';
import NotesPage from '../pages/NotesPage';
import AdminPage from '../pages/AdminPage';
import NotFound from '../pages/NotFound';
import AdminLogin from '../components/AdminLogin';
import ProtectedRoute from '../components/ProtectedRoute';
import ViewPage from '../pages/ViewPage'; // <-- 1. This import was missing

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/year/:yearId" element={<SubjectsPage />} />
      <Route path="/notes/:yearId/:subjectId" element={<NotesPage />} />

      {/* 2. This route was missing */}
      <Route path="/view/:noteId" element={<ViewPage />} />

      <Route path="/login" element={<AdminLogin />} />

      {/* Admin Protected Route */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } 
      />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;

