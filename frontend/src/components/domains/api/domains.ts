import http from '@/utils/http';

const URL = {
  allDomains: '/domain/',
};

export const getAllDomainsApi = async () => {
  return http().get(URL.allDomains);
};

export const addDomainApi = async (data: any) => {
  return http().post(URL.allDomains, data);
};

export const deleteDomain = async (id: string) => {
  return http().delete(`${URL.allDomains}${id}/`);
};

export const getDomainById = async (id: string) => {
  return http().get(`${URL.allDomains}${id}/`);
};
