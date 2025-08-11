import { Typography, Container, Paper } from '@mui/material';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">Welcome to Home Page</Typography>
        <Typography variant="body1">This is a protected home page.</Typography>
      </Paper>
    </Container>
  );
}
