import * as React from 'react';
import InputMask from 'react-input-mask';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { UserService } from '../services/user/UserService';
import { Api } from '../services/api/axios-config';

export const Registro: React.FC = () => {
  const [username, setUsername] = React.useState<string>('');
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [fieldsFilled, setFieldsFilled] = React.useState(false);
  const [messageError, setMessageError] = React.useState<string>('');
  const [cep, setCep] = React.useState<string>('');
  const [cpf, setCpf] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [street, setStreet] = React.useState<string>('');
  const [number, setNumber] = React.useState<string>('');
  const [city, setCity] = React.useState<string>('');
  const [uf, setUf] = React.useState<string>('');
  const [neighborhood, setNeighborhood] = React.useState<string>('');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setFieldsFilled(false);
    const data = {
      user: {
        name: username,
        email: email,
        posta_code: cep,
        password: password,
        cpf: cpf,
        phone: phone,
        street: street,
        number: number,
        city: city,
        uf: uf,
        neighborhood: neighborhood,
      },
    };

    const allFieldsFilled = Object.values(data.user).every(
      (field) => field.trim() !== ''
    );
    if (!allFieldsFilled) {
      setFieldsFilled(true);
      setMessageError('Preencha todos os campos!');
      return;
    }

    if (password != confirmPassword) {
      setFieldsFilled(true);
      setMessageError('Senha e Confirmação de Senha devem ser iguais');
      return;
    }

    console.log('handleSubmit', data);
    UserService.create(data)
      .then((res) => {
        if (res instanceof Error) {
          setError(true);
          console.log('res instanceof Error', res);
        } else {
          if (res.data) {
            setSuccess(true);
            setError(false);
          } else {
            console.log('else', res);
          }
        }
      })
      .catch(function (error) {
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
  const handleNumber = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setNumber(event.target.value);
  };
  const handleCEP = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    getAddress(event.target.value);
    setCep(event.target.value);
  };

  async function getAddress(value: string) {
    setStreet('');
    setCity('');
    setUf('');
    setNeighborhood('');

    if (value.replace('_', '').length !== 9) return;

    const response = await fetch(`https://viacep.com.br/ws/${value}/json/`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const data = await response.json();
    if (!data.erro) {
      setStreet(data.logradouro);
      setCity(data.localidade);
      setUf(data.uf);
      setNeighborhood(data.bairro);
    }
  }

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
      <Container component="main" maxWidth="md">
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

          {success ? (
            <p style={{ padding: '16px 0px' }}>
              Cadastro realizado com sucesso!
            </p>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    value={username}
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Nome Completo"
                    name="username"
                    autoFocus
                    onChange={handleUsername}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    value={email}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    onChange={handleEmail}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    value={password}
                    margin="normal"
                    required
                    fullWidth
                    name="new-password"
                    label="Senha"
                    type="password"
                    id="new-password"
                    onChange={handlePassword}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    value={confirmPassword}
                    margin="normal"
                    required
                    fullWidth
                    name="cNewPassword"
                    label="Confirme a Senha"
                    type="password"
                    id="cNewPassword"
                    onChange={handleConfirmPassword}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputMask
                    mask="999.999.999-99"
                    value={cpf}
                    onChange={handleCpf}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="cpf"
                      label="CPF"
                      name="cpf"
                      placeholder="XXX.XXX.XXX-XX"
                    />
                  </InputMask>
                </Grid>
                <Grid item xs={4}>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={phone}
                    onChange={handlePhone}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="phone"
                      label="Telefone"
                      name="phone"
                      placeholder="(XX) 9 9999-9999"
                    />
                  </InputMask>
                </Grid>
                <Grid item xs={4}>
                  <InputMask mask="99999-999" value={cep} onChange={handleCEP}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="cep"
                      label="CEP"
                      name="cep"
                      placeholder="00000-000"
                    />
                  </InputMask>
                </Grid>

                <Grid item xs={9}>
                  <TextField
                    value={street}
                    margin="normal"
                    required
                    fullWidth
                    name="street"
                    label="Endereço"
                    id="street"
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    value={number}
                    margin="normal"
                    required
                    fullWidth
                    name="number"
                    label="Nº"
                    type="number"
                    id="number"
                    onChange={handleNumber}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    value={neighborhood}
                    margin="normal"
                    required
                    fullWidth
                    name="neighborhood"
                    label="Bairro"
                    id="neighborhood"
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    margin="normal"
                    value={city}
                    required
                    fullWidth
                    name="city"
                    label="Cidade"
                    id="city"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    value={uf}
                    margin="normal"
                    required
                    fullWidth
                    name="uf"
                    label="UF"
                    id="uf"
                  />
                </Grid>
              </Grid>

              {fieldsFilled ? (
                <Alert severity="error">{messageError}</Alert>
              ) : null}

              {error ? (
                <Alert severity="error">
                  Erro ao enviar cadastro, confira se preencheu corretamente ou
                  e-mail e/ou CPF já foi cadastrado!
                </Alert>
              ) : null}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 6 }}
              >
                Cadastrar
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};
