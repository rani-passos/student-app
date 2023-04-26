import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Api } from '../services/api/axios-config';
import { UserService } from '../services/user/UserService';



export const Registro: React.FC = () => {
  const [username, setUsername] = React.useState<string>('');
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [cep, setCep] = React.useState<string>('');
  const [cpf, setCpf] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    const data = {
      user: {
        name: username,
        email: email,
        postal_code: cep,
        password: password,
        cpf: cpf,
        phone: phone,
      }
    };
    console.log('handleSubmit', data);
    UserService.create(data).then( res => {
      if (res instanceof Error) {
        setError(true);
        console.log('res instanceof Error',res);

      } else {
        if(res.data){
          setSuccess(true);
          setError(false);
        } else {
          console.log('else',res);
        }
      }
    }).catch(function (error) {
      console.error(error.response.data.messages);
    });
  };

  const handleUsername = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setUsername(event.target.value);
  };

  const handleEmail = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setEmail(event.target.value);
  };
  const handlePassword = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setPassword(event.target.value);
  };
  const handleConfirmPassword = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setConfirmPassword(event.target.value);
  };
  const handleCpf = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setCpf(event.target.value);
  };
  const handlePhone = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setPhone(event.target.value);
  };
  const handleCEP = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setCep(event.target.value);
  };

  return (
    <><AppBar
      position="fixed"
      sx={{
        padding: '8px 0px',
        backgroundColor: 'primary',
        color: '#FFF',
        boxShadow: 'none',
        borderBottom: '1px solid #ddd',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#FFF', }}>
        <Button variant="text" color='inherit' startIcon={<ChevronLeftIcon />} onClick={handleBack}>
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
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Cadastro
        </Typography>
        { error ? <p style={{  padding: '16px 0px' }}>Erro ao enviar cadastro, confira se preencheu corretamente ou e-mail e/ou CPF já foi cadastrado!</p> : '' }
        { success ? <p style={{  padding: '16px 0px' }}>Cadastro realizado com sucesso!</p> : (<Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            value={username}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nome Completo"
            name="username"
            autoFocus
            onChange={handleUsername} />
          <TextField
            value={email}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            onChange={handleEmail} />
          <TextField
            value={password}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            onChange={handlePassword} />
          <TextField
            value={confirmPassword}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirme a Senha"
            type="password"
            id="password"
            onChange={handleConfirmPassword} />
          <TextField
            value={cpf}
            margin="normal"
            required
            fullWidth
            id="cpf"
            label="CPF"
            name="cpf"
            placeholder='XXX.XXX.XXX-XX'
            onChange={handleCpf} />
          <TextField
            value={phone}
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Telefone"
            name="phone"
            placeholder='(XX) 9 9999-9999'
            onChange={handlePhone} />
          <TextField
            value={cep}
            margin="normal"
            required
            fullWidth
            id="cep"
            label="CEP"
            name="cep"
            placeholder='00000-000'
            onChange={handleCEP} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 6 }}
          >
              Cadastrar
          </Button>
        </Box>)}
      </Box>
    </Container></>
  );
};
