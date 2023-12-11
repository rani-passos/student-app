import { Api } from '../api/axios-config';

export interface INotifications {
  id: number;
  content: string;
  course: string;
  direction: string;
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
  notification: INotifications
): Promise<INotifications | Error> => {
  try {
    const { data } = await Api.get(
      `/notifications/${notification.id}/viewed/${notification.direction}`
    );
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
