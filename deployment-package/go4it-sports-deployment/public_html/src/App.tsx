import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';

// Pages
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import VideoAnalysis from './pages/VideoAnalysis';
import StarPath from './pages/StarPath';
import Academics from './pages/Academics';
import Profile from './pages/Profile';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-slate-900 text-white">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/starpath" element={
                    <ProtectedRoute>
                      <StarPath />
                    </ProtectedRoute>
                  } />
                  <Route path="/video-analysis" element={
                    <ProtectedRoute>
                      <VideoAnalysis />
                    </ProtectedRoute>
                  } />
                  <Route path="/academics" element={
                    <ProtectedRoute>
                      <Academics />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;