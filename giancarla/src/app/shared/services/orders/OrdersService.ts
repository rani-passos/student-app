import { Api } from '../api/axios-config';

export interface IOrders {
  id: number;
  access_until: string;
  access_start: string;
  status: string;
  course: string;
  lifetime: boolean;
  payment: {
    created_at: string;
    code: string;
    amount: number;
    status: string;
    method: string;
    installments: string;
  };
}

const getAll = async (): Promise<IOrders[] | Error> => {
  try {
    const { data } = await Api.get('/orders');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

export const OrdersService = {
  getAll,
};
