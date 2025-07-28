import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';

// import { getHeader, THeader } from '@/utils/header';
import { CONFIG } from '@/global/config';
import tokenService from '@/utils/token';

import { descrypt } from './encryption';
import { getHeader, THeader } from './header';

// NOTE: Default API endpoint from your .env file will be your root
const API_ROOT = CONFIG.BASE_API_URL;
const TIMEOUT = 200000;

/**
 * NOTE: API calling utility function
 *
 * @param {THeader} headerType
 * @param {string} baseURL
 * @param {number} timeout
 *
 * @returns
 */

const http = (
  headerType: THeader = 'json',
  baseURL: string = API_ROOT,
  timeout: number = TIMEOUT,
  params: any = {},
) => {
  const headers = getHeader(headerType);
  const client: AxiosInstance = axios.create({
    baseURL,
    timeout,
    headers,
    data: {},
    ...params,
  });

  // Intercept response object and handleSuccess and Error Object
  client.interceptors.response.use(handleSuccess, handleError);
  client.interceptors.request.use(async (req: any) => {
    //GET STORED ACCESS TOKEN
    const accesstoken: string = tokenService.getAccessToken();
    let token;
    if (accesstoken) {
      //DECRIPT THE ACCESS TOKEN
      const decrptedAccessToken = descrypt({ token: accesstoken, key: CONFIG.ENCRYPTION_KEY });
      if (decrptedAccessToken) {
        //IF TOKEN DECODE THE TOKEN
        const decoded: any = jwtDecode(decrptedAccessToken);

        //IF TOKEN IS EXPIRED THEN REFRESH THE TOKEN
        if (Date.now() >= decoded.exp * 1000) {
          const refreshtoken = tokenService.getRefreshToken();
          const decrptedRefreshToken = descrypt({
            token: refreshtoken,
            key: CONFIG.ENCRYPTION_KEY,
          });
          //FETCH THE NEW TOKEN WITH REFRESH TOKEN
          const data = await axios.post(`${baseURL}/refresh/`, {
            refresh: decrptedRefreshToken,
          });
          const newAccessToken = data?.data?.access;
          const newRefreshToken = data?.data?.refresh;
          // SET NEW TOKEN IN LOCAL STORAGE
          tokenService.setToken({ access: newAccessToken, refresh: newRefreshToken });
          token = newAccessToken;
        } else {
          token = decrptedAccessToken;
        }
      }
    }

    if (token) {
      req.headers['Authorization'] = 'Bearer ' + token;
    }

    return req;
  }, (error: any) => {
    return Promise.reject(error);
  });

  function handleSuccess(response: AxiosResponse) {
    return response;
  }

  function handleError(error: AxiosError) {
    const data = error.response?.data;
    return Promise.reject(data);
  }

  function get(path: string, config?: AxiosRequestConfig) {
    return client.get(path, config).then((response) => response.data);
  }

  function post(path: string, payload: any, config?: AxiosRequestConfig) {
    return client.post(path, payload, config).then((response) => response.data);
  }

  function put(path: string, payload: any) {
    return client.put(path, payload).then((response) => response.data);
  }

  function patch(path: string, payload: any) {
    return client.patch(path, payload).then((response) => response.data);
  }

  function _delete(path: string, data?: any) {
    if (data) {
      return client.delete(path, { data: data }).then((response) => response.data);
    }
    return client.delete(path).then((response) => response.data);
  }

  return {
    get,
    post,
    put,
    patch,
    delete: _delete,
  };
};

export default http;
