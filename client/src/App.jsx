import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoadingAuth from './components/LoadingAuth';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingAuth />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente para redirigir usuarios autenticados
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingAuth />;
  }
  
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// Componente para la ruta principal que muestra Landing o Dashboard según autenticación
const HomeRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingAuth />;
  }
  
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
};

function App() {
  return (
    <Routes>
      {/* Ruta principal - Landing para no logueados, Dashboard para logueados */}
      <Route path="/" element={<HomeRoute />} />
      
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta catch-all - redirigir a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
