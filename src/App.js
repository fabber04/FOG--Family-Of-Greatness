import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LibraryProvider } from './contexts/LibraryContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Library from './pages/Library';
import Podcasts from './pages/Podcasts';
import GeniusAcademy from './pages/GeniusAcademy';
import Events from './pages/Events';
import Counseling from './pages/Counseling';
import Devotionals from './pages/Devotionals';
import PrayerRequests from './pages/PrayerRequests';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <Router>
          <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/members" element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <Members />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <Layout>
                  <Library />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/podcasts" element={
              <ProtectedRoute>
                <Layout>
                  <Podcasts />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/masterclass" element={
              <ProtectedRoute>
                <Layout>
                  <GeniusAcademy />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <Layout>
                  <Events />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/counseling" element={
              <ProtectedRoute>
                <Layout>
                  <Counseling />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/devotionals" element={
              <ProtectedRoute>
                <Layout>
                  <Devotionals />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/prayer-requests" element={
              <ProtectedRoute>
                <Layout>
                  <PrayerRequests />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
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