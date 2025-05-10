import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom'; 

function NoPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: '8rem',
          fontWeight: 'bold',
          color: (theme) => theme.palette.primary.main,
          marginBottom: (theme) => theme.spacing(1),
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" marginBottom={2}>
        The page you are looking for does not exist.
      </Typography>
      <Button
        component={Link} 
        to="/"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
      >
        Go Back Home
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Check your URL or return to the homepage
      </Typography>
    </Container>
  );
}

 
export default NoPage;