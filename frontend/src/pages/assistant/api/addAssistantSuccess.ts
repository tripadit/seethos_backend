import http from '@/utils/http';

import { IAssistant } from '../types/addAssistantSuccess';

const URL = {
  assistant: '/chatbot/',
};

export const getAssistantByIdApi = async ({ queryKey }: any): Promise<IAssistant> => {
  const { id } = queryKey[1];
  return http().get(URL.assistant + id + '/');
};
