import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { IUserData, UserService } from '../../shared/services/user/UserService';
import { AppBar, CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';

export const Esqueci: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    UserService.forgotPassword(email).then((result: any) => {
      if (result instanceof Error) {
        setSuccess('');
        setError(result.message);
      } else {
        setError('');
        setSuccess(result.messages);
      }
      setLoading(false);
    });
  };

  const handleEmail = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setSuccess('');
    setError('');
    setEmail(event.target.value);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          padding: '8px 0px',
          backgroundColor: 'primary',
          color: '#FFF',
          boxShadow: 'none',
          borderBottom: '1px solid #ddd',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#FFF',
          }}
        >
          <Button
            variant="text"
            color="inherit"
            startIcon={<ChevronLeftIcon />}
            onClick={handleBack}
          >
            Voltar
          </Button>
        </Box>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mb={1}>
            Alterar Senha
          </Typography>
          <Typography component="p" variant="body1">
            Informe o e-mail cadastrado abaixo.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              value={email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmail}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Recuperar Senha
            </Button>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '16px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              ''
            )}
            <Typography color="error" variant="h6">
              {error ? error : ''}
            </Typography>
            <Typography color="primary" variant="h6">
              {success ? success : ''}
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};
