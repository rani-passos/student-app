import React, { useEffect } from 'react';
import { useAuthContext } from '../contexts';
import { Navigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import $ from 'jquery';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      $('#loading').fadeOut('slow');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setError('');
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
            <div className="col-lg-5 col-md-12 align-self-center">
              <div className="sign-user_card ">
                <div className="sign-in-page-data">
                  <div className="sign-in-from w-100 m-auto">
                    <h3 className="mb-3 text-center">
                      Iniciar sessão na sua conta
                    </h3>
                    <form className="mt-4" action="#" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control mb-0"
                          id="inputEmail"
                          autoComplete="off"
                          onChange={handleEmail}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Senha</label>
                        <input
                          type="password"
                          className="form-control mb-0"
                          id="inputPassword"
                          onChange={handlePassword}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-hover w-100 mt-3"
                      >
                        Entrar
                      </button>
                    </form>

                    <div className="mt-2">
                      <Typography color="error">{error}</Typography>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex justify-content-center links">
                    Não tem uma conta?{' '}
                    <a href="/registro" className="text-primary ml-2">
                      Cadastre-se
                    </a>
                  </div>
                  <div className="d-flex justify-content-center links">
                    <a href="/esqueci" className="f-link">
                      Esqueceu-se da sua senha?
                    </a>
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
