import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LibraryProvider } from './contexts/LibraryContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Library from './pages/Library';
import Podcasts from './pages/Podcasts';
import GeniusAcademy from './pages/GeniusAcademy';
import Events from './pages/Events';
import Counseling from './pages/Counseling';
import Devotionals from './pages/Devotionals';
import PrayerRequests from './pages/PrayerRequests';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminPodcasts from './pages/admin/AdminPodcasts';
import AdminLibrary from './pages/admin/AdminLibrary';
import AdminGeniusAcademy from './pages/admin/AdminGeniusAcademy';
import AdminCounseling from './pages/admin/AdminCounseling';
import AdminDevotionals from './pages/admin/AdminDevotionals';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <Router>
          <div className="App">
          <Routes>
            {/* Redirect login/register/profile to home for beta launch */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<Navigate to="/" replace />} />
            
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />

            <Route path="/members" element={
              <Layout>
                <Members />
              </Layout>
            } />
            <Route path="/library" element={
              <Layout>
                <Library />
              </Layout>
            } />
            {/* Public routes - must come before admin routes */}
            <Route path="/podcasts" element={
              <Layout>
                <Podcasts />
              </Layout>
            } />
            <Route path="/masterclass" element={
              <Layout>
                <GeniusAcademy />
              </Layout>
            } />
            <Route path="/events" element={
              <Layout>
                <Events />
              </Layout>
            } />
            <Route path="/counseling" element={
              <Layout>
                <Counseling />
              </Layout>
            } />
            <Route path="/devotionals" element={
              <Layout>
                <Devotionals />
              </Layout>
            } />
            <Route path="/prayer-requests" element={
              <Layout>
                <PrayerRequests />
              </Layout>
            } />
            
            {/* Admin routes - must come after public routes */}
            <Route path="/admin" element={
              <Layout>
                <AdminDashboard />
              </Layout>
            } />
            <Route path="/admin/events" element={
              <Layout>
                <AdminEvents />
              </Layout>
            } />
            <Route path="/admin/podcasts" element={
              <Layout>
                <AdminPodcasts />
              </Layout>
            } />
            <Route path="/admin/library" element={
              <Layout>
                <AdminLibrary />
              </Layout>
            } />
            <Route path="/admin/masterclass" element={
              <Layout>
                <AdminGeniusAcademy />
              </Layout>
            } />
            <Route path="/admin/counseling" element={
              <Layout>
                <AdminCounseling />
              </Layout>
            } />
            <Route path="/admin/devotionals" element={
              <Layout>
                <AdminDevotionals />
              </Layout>
            } />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App; 