import { useState } from 'react';
import {
  Button,
  Stack,
  TextField,
  Alert,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { loginApiKey } from '../api/authApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';

type LocationState = { from?: { pathname: string } };

export default function LoginForm() {
  const { storeToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname ?? '/clean';

  const [apiKey, setApiKey] = useState('');
  const [err, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const { token } = await loginApiKey(apiKey);
      storeToken(token);
      navigate(from);
    } catch (error) {
      if (axios.isAxiosError<{ detail?: string }>(error)) {
        const backendDetail = error.response?.data?.detail;
        if (backendDetail) {
          setError(backendDetail);
        } else if (error.response?.status) {
          setError(`Login failed (HTTP ${error.response.status})`);
        } else {
          setError('Network error — please try again');
        }
      } else {
        setError('Unexpected error — please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 420,
        mx: 'auto',
        mt: 8,
        borderRadius: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        API Login
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="API Key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          fullWidth
          size="small"
        />
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!apiKey || loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : undefined
          }
        >
          {loading ? 'Logging in…' : 'Login'}
        </Button>
        {err && <Alert severity="error">{err}</Alert>}
      </Stack>
    </Paper>
  );
}
