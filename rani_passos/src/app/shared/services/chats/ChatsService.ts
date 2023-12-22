import { Api } from '../api/axios-config';

export interface IChats {
  question: string;
  answer: string;
}

export interface IInformations {
  content: string;
}

export interface ITips {
  content: string;
}

const getAll = async (): Promise<IChats[] | Error> => {
  try {
    const { data } = await Api.get('/chat_gpt_messages');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const getInformations = async (): Promise<IInformations[] | Error> => {
  try {
    const { data } = await Api.get('/chat_gpt_messages/informations');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const getTips = async (): Promise<ITips[] | Error> => {
  try {
    const { data } = await Api.get('/chat_gpt_messages/tips');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const dailyQuota = async (): Promise<any | Error> => {
  try {
    const { data } = await Api.get('/chat_gpt_messages/daily_quota');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const create = async (chat: IChats): Promise<any | Error> => {
  try {
    const { data } = await Api.post('/chat_gpt_messages', chat);
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

export const ChatsService = {
  getAll,
  create,
  dailyQuota,
  getInformations,
  getTips,
};
