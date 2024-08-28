import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserTemplate from './pages/userLinkPage';
import AdminPage from './pages/adminPage';
import AdminLogin from './pages/adminLogin';
import PrivateRoute from './privateRoute';
import PublicRoute from './publicRoute';

const App: React.FC = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/admin" element={<PublicRoute element={<AdminLogin />} />} />
        <Route path="/" element={<UserTemplate />} />
        <Route path="/:username" element={<UserTemplate />} />

        {/* Protected Routes */}
        <Route
          path="/admin-access"
          element={<PrivateRoute element={<AdminPage />} />}
        />
        <Route
          path="/update-user/:username"
          element={<PrivateRoute element={<AdminPage />} />}
        />
      </Routes>
  );
};

export default App;
