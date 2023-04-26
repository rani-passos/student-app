import { AxiosError } from 'axios';

export const errorInterceptor = (err: AxiosError) => {
  // sessionStorage.removeItem('TOKEN');
  // sessionStorage.removeItem('USER_AUTHENTICATION_TOKEN');
  // sessionStorage.removeItem('USER_EMAIL');
  // sessionStorage.removeItem('USER_DATA');
  // if (err.response?.status === 401) {
  //   window.location.reload();
  // }
  if (err.message === 'Network Error') {
    return Promise.reject(new Error('Erro de conexão'));
  }

  return Promise.reject(err);
};
