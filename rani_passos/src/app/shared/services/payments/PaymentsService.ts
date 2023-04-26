import { Api } from '../api/axios-config';

export interface IPaymentsList {
  id: number;
  amount: number;
  method: string;
  duration: string;
  discount: string;
  status: string | null;
  billet_pdf: number | null;
  billet_expiry_date: number | null;
  pix_qrcode_text: number | null;
  error: string | null;
  course: {
    title: string | null;
  };
}

const getAll = async (): Promise<any | Error> => {
  try {
    const { data } = await Api.get('/payments');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

export const PaymentsService = {
  getAll,
};
