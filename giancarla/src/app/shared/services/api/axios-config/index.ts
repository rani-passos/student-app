import { authInterceptor } from './interceptors/AuthInterceptor';
import axios from 'axios';

import { errorInterceptor } from './interceptors/ErrorInterceptor';
import { responseInterceptor } from './interceptors/ResponseInterceptor';
import { Environment } from '../../../environment';

const Api = axios.create({
  baseURL: `${Environment.URL_BASE}api/v1`,
});

Api.interceptors.response.use(
  (res) => responseInterceptor(res),
  (err) => errorInterceptor(err)
);

Api.interceptors.request.use((config) => authInterceptor(config));

export { Api };
