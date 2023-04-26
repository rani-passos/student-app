import { InternalAxiosRequestConfig } from 'axios';

export const authInterceptor = (config: InternalAxiosRequestConfig) => {
  let token = undefined;
  let authentication_token = undefined;
  let user_email = undefined;

  try {
    token = JSON.parse(sessionStorage.getItem('TOKEN') || '');
    authentication_token = JSON.parse(
      sessionStorage.getItem('USER_AUTHENTICATION_TOKEN') || ''
    );
    user_email = JSON.parse(sessionStorage.getItem('USER_EMAIL') || '');
  } catch (error) {
    console.log('responseInterceptor::Error sem DADOS ainda');
  }

  if (token && authentication_token && user_email && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['X-User-Token'] = `${authentication_token}`;
    config.headers['X-User-Email'] = `${user_email}`;
  }
  return config;
};
