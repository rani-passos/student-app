import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '../contexts';
import { UserService } from '../services/user/UserService';
import { Navigate } from 'react-router-dom';
import logo from 'rani_passos/public/assets/images/logo.svg';
import $ from 'jquery';

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

  const { login } = useAuthContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      $('#loading').fadeOut('slow');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const { isAuth } = useAuthContext();
  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setFieldsFilled(false);
    setMessageError('');
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
      .then(async (res) => {
        if (res instanceof Error) {
          setError(true);
          console.log('res instanceof Error', res);
        } else {
          if (res.data) {
            await login(email, password);
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
      <div id="loading">
        <div id="loading-center"></div>
      </div>

      <header id="main-header">
        <div className="main-header">
          <div className="container-fluid py-3">
            <div className="row">
              <div className="col-sm-12">
                <nav className="navbar navbar-expand-lg navbar-light p-0">
                  <a className="navbar-brand" href="/">
                    {' '}
                    <img
                      className="img-fluid logo"
                      src={logo}
                      alt="Logo Rani"
                    />{' '}
                  </a>
                </nav>
                <div className="nav-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="page-title-box">
        <div
          className="container-fluid page-title"
          style={{ paddingTop: 25 }}
        ></div>
      </section>

      <section className="space-mtb">
        <div className="container">
          <div className="row justify-content-center align-items-center height-self-center">
            <div className="col-lg-10 col-md-12 align-self-center">
              <a className="btn btn-hover mb-5" href="/">
                Voltar
              </a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center align-items-center height-self-center">
            <div className="col-lg-10 col-md-12 align-self-center">
              <div className="sign-user_card ">
                <div className="sign-in-page-data">
                  <div className="sign-in-from w-100 m-auto">
                    <h3 className="mb-3 text-center">CADASTRO</h3>
                    <form className="mt-4" action="#" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group">
                            <label>Nome Completo</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="username"
                              onChange={handleUsername}
                              autoComplete="off"
                              name="username"
                              value={username}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              className="form-control mb-0"
                              id="email"
                              onChange={handleEmail}
                              autoComplete="off"
                              name="email"
                              value={email}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group">
                            <label>Senha</label>
                            <input
                              type="password"
                              className="form-control mb-0"
                              id="newPassword"
                              onChange={handlePassword}
                              autoComplete="off"
                              name="newPassword"
                              value={password}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group">
                            <label>Confirme a Senha</label>
                            <input
                              type="password"
                              className="form-control mb-0"
                              id="cNewPassword"
                              onChange={handleConfirmPassword}
                              autoComplete="off"
                              name="cNewPassword"
                              value={confirmPassword}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                          <div className="form-group">
                            <label>CPF</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="cpf"
                              onChange={handleCpf}
                              autoComplete="off"
                              name="cpf"
                              value={cpf}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                          <div className="form-group">
                            <label>Telefone</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="phone"
                              onChange={handlePhone}
                              autoComplete="off"
                              name="phone"
                              value={phone}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                          <div className="form-group">
                            <label>CEP</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="cep"
                              onChange={handleCEP}
                              autoComplete="off"
                              name="cep"
                              value={cep}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-9 col-md-12">
                          <div className="form-group">
                            <label>Endereço</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="street"
                              onChange={(e) => setStreet(e.target.value)}
                              autoComplete="off"
                              name="street"
                              value={street}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-12">
                          <div className="form-group">
                            <label>Nº</label>
                            <input
                              type="number"
                              className="form-control mb-0"
                              id="number"
                              onChange={handleNumber}
                              autoComplete="off"
                              name="number"
                              value={number}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-5 col-md-12">
                          <div className="form-group">
                            <label>Bairro</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="neighborhood"
                              onChange={(e) => setNeighborhood(e.target.value)}
                              autoComplete="off"
                              name="neighborhood"
                              value={neighborhood}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-5 col-md-12">
                          <div className="form-group">
                            <label>Cidade</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="city"
                              onChange={(e) => setCity(e.target.value)}
                              autoComplete="off"
                              name="city"
                              value={city}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-12">
                          <div className="form-group">
                            <label>UF</label>
                            <input
                              type="text"
                              className="form-control mb-0"
                              id="uf"
                              onChange={(e) => setUf(e.target.value)}
                              autoComplete="off"
                              name="uf"
                              value={uf}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {fieldsFilled ? (
                        <Alert severity="error">{messageError}</Alert>
                      ) : null}

                      {error ? (
                        <Alert severity="error">
                          Erro ao enviar cadastro, confira se preencheu
                          corretamente ou e-mail e/ou CPF já foi cadastrado!
                        </Alert>
                      ) : null}

                      <button
                        type="submit"
                        className="btn btn-hover w-100 mt-3"
                      >
                        Cadastrar
                      </button>
                    </form>

                    <div className="mt-2">
                      <Typography color="error">{error}</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
