import axios from 'axios';

import http from '@/utils/http';

import { IScrapeSiteMapResponse, IUploadFile } from '../types/addAssistance';
import { IAssistant } from '../types/addAssistantSuccess';

const URL = {
  user: '/account/',
  file: '/file/',
  siteMap: 'https://scrap.duality.junkirilabs.com/scrape-sitemap_links',
  assistant: '/chatbot/',
  sitemap: '/sitemap/',
  generateNames: '/chatbot/generate_asistant_name/',
};

export const updateUserApi = async (data: any) => {
  return http('multipart').post(URL.user + 'me/', data);
};

export const uploadTraningFileApi = async (data: FormData): Promise<IUploadFile> => {
  return http('multipart').post(URL.file, data);
};

export const scrapeSiteMapApi = async (
  siteMap: Record<string, string>,
): Promise<IScrapeSiteMapResponse> => {
  const data: any = await axios.post(URL.siteMap, siteMap);
  return data?.data;
};

export const deleteTraningFileApi = (id: string) => {
  return http().delete(URL.file + id + '/');
};

export const createAssistantApi = async (data: any) => {
  return http('multipart').post(URL.assistant, data);
};

export const addAssistantSitemapApi = async (data: any) => {
  return http().post(URL.sitemap, data);
};

export const getAssistantDetailApi = async ({ queryKey }: any): Promise<IAssistant> => {
  const { id } = queryKey[1];
  return http().get(URL.assistant + id + '/');
};

export const deployAssistantApi = async ({ id }: any) => {
  console.log("Attempting to deploy assistant with ID:", id);
  try {
    const response = await http().post(URL.assistant + id + '/deploy_chat_bot/', {});
    console.log("Deployment request successful:", response);
    return response;
  } catch (error) {
    console.error("Deployment request failed:", error);
    throw error;
  }
};

export const updateAssistantApi = async ({ id }: any) => {
  return http('multipart').post(URL.assistant + id + '/update_chat_bot/', {});
};

export const updateAssistantDataApi = async ({ id, body }: any) => {
  return http('multipart').put(URL.assistant + id + '/', body);
};

export const getAssistantNames = async (body: any) => {
  return http().post(URL.generateNames, body);
};

export const getAssistantAvatars = async (req: { page: number }) => {
  return http().get('/review/get_avatar_image/', {
    params: {
      page: req.page,
      size: 5,
    },
  });
};
