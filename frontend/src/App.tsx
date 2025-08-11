import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import CleanerForm from './components/CleanerForm';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/clean')}
          >
            Content Cleaner
          </Typography>
          <Box sx={{ flex: 1 }} />
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/clean"
          element={
            <ProtectedRoute>
              <CleanerForm />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/clean" replace />} />
      </Routes>
    </>
  );
}
