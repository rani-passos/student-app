import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { Api } from '../services/api/axios-config';
import { CircularProgress } from '@mui/material';
import { IUserData, UserService } from '../../shared/services/user/UserService';

interface IReset {
  reset: {
    password: string,
    password_confirmation: string,
    token: string
   }
}


export const Reset: React.FC = () => {
  const location = useLocation();
  const token = location.pathname.split('/')[1];
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    UserService.resetPassword(password, confirmPassword, token).then( (result:any) =>{
      if (result instanceof Error) {
        setSuccess('');
        setError(result.message);
      } else {
        setError('');
        setSuccess(result.messages);
        setTimeout(() => {
          navigate('/');
        }, 2000);

      }
      setLoading(false);
    }
    );
  };

  const handlePassword = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setPassword(event.target.value);
  };
  const handleConfirmPassword = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setConfirmPassword(event.target.value);
  };

  return (
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
        <Typography component="h1" variant="h5">
          Alterar Senha
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
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
          />
          <TextField
            value={confirmPassword}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirme a Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleConfirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
              Alterar Senha
          </Button>
          {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', margin: '16px' }}>
            <CircularProgress />
          </Box> : ''}
          <Typography color='error' variant='h6'>{error ? error : ''}</Typography>
          <Typography color='primary' variant='h6'>{success ? 'Deu tudo certo! Redirecionando...' : ''}</Typography>
        </Box>
      </Box>
    </Container>
  );
};
