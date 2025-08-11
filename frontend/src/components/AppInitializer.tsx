import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/useAuth';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Initializing...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
