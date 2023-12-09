import * as React from 'react';
import { useAuthContext } from '../contexts';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { Navigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import logo from 'rani_passos/public/assets/images/logo.svg';

export const Login: React.FC = () => {
  const { isAuth } = useAuthContext();
  if (isAuth) {
    return <Navigate to="/" replace />;
  }
  const [error, setError] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const { login } = useAuthContext();

  const handleSubmit = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    const message = await login(email, password);
    if (message && message?.includes('Request failed')) {
      setError('Ocorreu um erro na validação dos dados, tente novamente!');
    }
    console.log(error);
  };

  const handleEmail = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setEmail(event.target.value);
  };
  const handlePassword = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'background.paper',
          color: '#000',
          boxShadow: 'none',
          borderBottom: '1px solid #ddd',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <Box
              component="img"
              src={logo}
              sx={{
                height: 'auto',
                width: 200,
                display: 'flex',
                color: 'inherit',
              }}
            />

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'end',
              }}
            >
              <Button
                variant="contained"
                sx={{ paddingLeft: '16px', paddingRight: '16px' }}
                href="https://www.ranipassos.com.br/courses/assinatura-completa"
                target="_blank"
              >
                Seja Assinante
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Entrar
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
              error={!!error}
            />
            <TextField
              value={password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handlePassword}
              error={!!error}
            />
            <Typography color="error">{error}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 4 }}
            >
              Entrar
            </Button>
          </Box>
          <Grid container>
            <Grid
              item
              xs
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Link href="/esqueci" variant="body1" underline="none">
                Esqueceu a senha?
              </Link>
              <Link href="/registro" variant="body1" underline="none">
                Cadastre-se
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
