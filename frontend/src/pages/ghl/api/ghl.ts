import http from '@/utils/http';

const URL = {
  ghl: 'gohighlevel',
};

export const connectGHLApi = () => {
  return http().get(URL.ghl + '/get_link/');
};
export const linkGHLApi = (data: any) => {
  return http().post(URL.ghl + '/link_highlevel/', data);
};
export const disconnectGHLApi = () => {
  return http().post(URL.ghl + '/unlink_highlevel/', {});
};
