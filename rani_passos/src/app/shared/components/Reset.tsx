import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { IUserData, UserService } from '../../shared/services/user/UserService';
import logo from 'rani_passos/public/assets/images/logo.svg';
import $ from 'jquery';

interface IReset {
  reset: {
    password: string;
    password_confirmation: string;
    token: string;
  };
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

  useEffect(() => {
    const timer = setTimeout(() => {
      $('#loading').fadeOut('slow');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    UserService.resetPassword(password, confirmPassword, token).then(
      (result: any) => {
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
            <div className="col-lg-6 col-md-12 align-self-center">
              <div className="sign-user_card ">
                <div className="sign-in-page-data">
                  <div className="sign-in-from w-100 m-auto">
                    <h3 className="mb-3 text-center">Alterar Senha</h3>
                    <form className="mt-4" action="#" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Senha</label>
                        <input
                          type="password"
                          className="form-control mb-0"
                          id="password"
                          onChange={handlePassword}
                          autoComplete="off"
                          name="password"
                          value={password}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirme a Senha</label>
                        <input
                          type="password"
                          className="form-control mb-0"
                          id="confirmPassword"
                          onChange={handleConfirmPassword}
                          autoComplete="off"
                          name="confirmPassword"
                          value={confirmPassword}
                          required
                        />
                      </div>

                      <Typography color="error" variant="h6">
                        {error ? error : ''}
                      </Typography>
                      <Typography color="primary" variant="h6">
                        {success ? 'Deu tudo certo! Redirecionando...' : ''}
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
