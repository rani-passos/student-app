import {
  useCallback,
  useContext,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/api/axios-config/auth/AuthService';
interface IAuthContextData {
  isAuth: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<string | void>;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({} as IAuthContextData);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('TOKEN');
    if (token) {
      setToken(JSON.parse(token));
    } else {
      setToken(undefined);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    if (result instanceof Error) {
      return result.message;
    } else {
      setToken(result.token);
      if (result.token) {
        sessionStorage.setItem('TOKEN', JSON.stringify(result.token));
        sessionStorage.setItem('USER_AUTHENTICATION_TOKEN', JSON.stringify(result.data.user.authentication_token));
        sessionStorage.setItem('USER_EMAIL', JSON.stringify(result.data.user.email));
        sessionStorage.setItem('USER_DATA', JSON.stringify(result.data.user));
        sessionStorage.setItem('USER_CHAR', JSON.stringify(result.data.user.name.split(' ')[0].charAt(0) + result.data.user.name.split(' ')[1].charAt(0)));
        setToken(result.token);
      }
    }
  }, []);
  const handleLogout = useCallback(() => {
    setToken(undefined);
    sessionStorage.removeItem('TOKEN');
    sessionStorage.removeItem('USER_AUTHENTICATION_TOKEN');
    sessionStorage.removeItem('USER_EMAIL');
    sessionStorage.removeItem('USER_DATA');
    navigate('/');
  }, []);
  const isAuth = useMemo(() => !!token, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuth, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
