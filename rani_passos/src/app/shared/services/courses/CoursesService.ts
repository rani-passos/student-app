import { Api } from '../api/axios-config';

const options = {
  method: 'GET',
};

export interface ICoursesList {
  id: number;
  title: string;
  slug: string;
  description: string;
  status_access: string;
  image: string;
}

export interface IModules {
  id: number;
  name: string;
  lessons: [
    {
      id: number;
      title: string;
      released: boolean;
    }
  ];
}

const getAll = async (page = 1, search = ''): Promise<any | Error> => {
  try {
    const { data } = await Api.get(`/courses?search=${search}&page=${page}`);
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const getModulesById = async (id: number): Promise<any> => {
  try {
    const { data } = await Api.get(`/courses/${id}/capsules`);
    return data;
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const accessChatRav = async (): Promise<any | Error> => {
  try {
    const { data } = await Api.get('courses/access_chat_rav');
    return data;
  } catch (error) {
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const getLessonsById = async (
  course_id: number,
  module_id: number,
  lesson_id: number
): Promise<any> => {
  try {
    // /api/1v / courses / 62 / capsules / 4 / lessons / 4;
    const { data } = await Api.get(
      `/courses/${course_id}/capsules/${module_id}/lessons/${lesson_id}`
    );
    console.log(data);
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar registros.'
    );
  }
};

const getAttended = async (
  course_id: number,
  module_id: number,
  lesson_id: number
): Promise<any> => {
  try {
    const { data } = await Api.get(
      `/courses/${course_id}/capsules/${module_id}/lessons/${lesson_id}/user_attended_lesson`
    );
    console.log(data);
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao marcar aula.'
    );
  }
};

const getNotAttended = async (
  course_id: number,
  module_id: number,
  lesson_id: number
): Promise<any> => {
  try {
    const { data } = await Api.get(
      `/courses/${course_id}/capsules/${module_id}/lessons/${lesson_id}/user_not_attended_lesson`
    );
    console.log(data);
  } catch (error) {
    console.log(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao marcar aula.'
    );
  }
};

export const CoursesService = {
  getAll,
  getModulesById,
  getLessonsById,
  getAttended,
  getNotAttended,
  accessChatRav,
};
