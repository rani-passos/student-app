import { Api } from '../api/axios-config';

export interface ITerms {
  content: string;
}

const checkedUser = async (): Promise<any | Error> => {
  try {
    const { data } = await Api.get('/terms_of_uses/checked_user');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const lastTerm = async (): Promise<ITerms | Error> => {
  try {
    const { data } = await Api.get('/terms_of_uses/last_term');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const create = async (): Promise<any | Error> => {
  try {
    const { data } = await Api.post('/terms_of_uses');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

export const TermsService = {
  lastTerm,
  create,
  checkedUser,
};
