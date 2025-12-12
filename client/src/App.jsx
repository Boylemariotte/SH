import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user ? children : <Navigate to="/login" replace />;
};

// Componente para redirigir usuarios autenticados
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user ? <Navigate to="/" replace /> : children;
};

// Componente para la ruta principal que muestra Landing o Dashboard según autenticación
const HomeRoute = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user ? <Dashboard /> : <LandingPage />;
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
