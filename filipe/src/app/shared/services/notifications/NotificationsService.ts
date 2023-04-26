import { Api } from '../api/axios-config';

export interface INotifications {
  id: number;
  content: string;
  course: string;
}

const getAll = async (): Promise<INotifications[] | Error> => {
  try {
    const { data } = await Api.get('/notifications');
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};
const getViewed = async (
  notification_id: number
): Promise<INotifications | Error> => {
  try {
    const { data } = await Api.get(`/notifications/${notification_id}/viewed`);
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

export const NotificationsService = {
  getAll,
  getViewed,
};
