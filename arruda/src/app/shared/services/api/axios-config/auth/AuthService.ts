import { Api } from '..';

interface IAuth {
  messages: string;
  is_success: true;
  data: {
    user: {
      id: number;
      name: string;
      cpf: string;
      phone: string;
      status: string;
      email: string;
      authentication_token: string;
    };
  };
  token: string;
}

const auth = async (
  email: string,
  password: string
): Promise<IAuth | Error> => {
  const dadosDeLogin = {
    sign_in: {
      email: email,
      password: password,
    },
  };
  try {
    const { data } = await Api.post('/sign_in', dadosDeLogin);
    return data;
  } catch (error) {
    return new Error((error as { message: string }).message || 'Erro.');
  }
};
export const AuthService = { auth };
