import { Api } from '../api/axios-config';

export interface IUserData {
  id: number;
  company_id: number;
  name: string;
  birth_date: null;
  cpf: string;
  phone: string;
  status: string;
  email: string;
  created_at: string;
  updated_at: string;
  authentication_token: string;
  use_chat: boolean;
}

interface IUser {
  user: {
    name: string;
    email: string;
    posta_code: string;
    password: string;
    cpf: string;
    phone: string;
    street: string;
    number: string;
    city: string;
    uf: string;
    neighborhood: string;
  };
}

const getAll = async (): Promise<any | Error> => {
  try {
    const { data } = await Api.get('users/me');
    return data;
  } catch (error) {
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};
const create = async (user: IUser): Promise<any | Error> => {
  try {
    const { data } = await Api.post('users', user);
    return data;
  } catch (error) {
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};
const update = async (user: IUser, id: number): Promise<any | Error> => {
  try {
    const result = await Api.put(`users/${id}`, user);
    return result;
  } catch (error) {
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const forgotPassword = async (email: string): Promise<any | Error> => {
  const forgot = { email: email };
  try {
    const { data } = await Api.post('forgot_password', {
      forgot,
    });
    return data;
  } catch (error: any) {
    console.log('erro forgot', error.response.data);
    return new Error(
      error.response.data.messages || 'Erro ao listar registros.'
    );
  }
};

const resetPassword = async (
  password: string,
  password_confirmation: string,
  token: string
): Promise<any | Error> => {
  const reset = {
    password: password,
    password_confirmation: password_confirmation,
    token: token,
  };
  try {
    const { data } = await Api.post('reset_password', {
      reset,
    });
    return data;
  } catch (error: any) {
    return new Error(
      error.response.data.messages || 'Erro ao listar registros.'
    );
  }
};

export const UserService = {
  getAll,
  forgotPassword,
  resetPassword,
  create,
  update,
};
