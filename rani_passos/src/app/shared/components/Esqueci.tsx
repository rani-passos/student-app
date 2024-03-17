import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { IUserData, UserService } from '../../shared/services/user/UserService';
import { useNavigate } from 'react-router-dom';
import logo from 'rani_passos/public/assets/images/logo.svg';
import $ from 'jquery';

export const Esqueci: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      $('#loading').fadeOut('slow');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
            <div className="col-lg-6 col-md-12 align-self-center">
              <div className="sign-user_card ">
                <div className="sign-in-page-data">
                  <div className="sign-in-from w-100 m-auto">
                    <form className="mt-4" action="#" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Informe o e-mail cadastrado abaixo.</label>
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

                      <Typography color="error">
                        {error ? error : ''}
                      </Typography>
                      <Typography color="primary">
                        {success ? success : ''}
                      </Typography>

                      <button
                        type="submit"
                        className="btn btn-hover w-100 mt-3"
                      >
                        Recuperar Senha
                      </button>
                    </form>
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
