import http from '@/utils/http';

import {
  ICampaignListResponse,
  ICampaingnList,
  ICommmonList,
  ISenderEmailListResponse,
} from '../types/campaingn';

const URL = {
  emailCampaign: '/email-campaign/',
  senderEmail: '/sender-email/',
  sequenceCampaign: '/sequence-campaign/',
  emailSequence: '/email-sequence/',
  putEmailSequence: '/email-sequence/:id',
};
export const getCampignList = async (): Promise<ICampaignListResponse> => {
  return http().get(URL.emailCampaign, {
    params: {
      page: 1,
      size: 500,
    },
  });
};

export const getSequenceCampaignList = async (): Promise<ICampaignListResponse> => {
  return http().get(URL.sequenceCampaign, {
    params: {
      page: 1,
      size: 500,
    },
  });
};

export const getSenderEmailListApi = async (): Promise<ISenderEmailListResponse> => {
  return http().get(URL.senderEmail);
};

export const createSenderEmailApi = async (body: any) => {
  return http().post(URL.senderEmail, body);
};

export const deleteSenderEmailApi = async (id: number) => {
  return http().delete(URL.senderEmail + id + '/');
};

export const createCampaignApi = async (body: any) => {
  return http().post(URL.emailCampaign, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createSequenceCampaignApi = async (body: any) => {
  return http().post(URL.sequenceCampaign, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createEmailSequence = async (body: any) => {
  return http().post(URL.emailSequence, body);
};

export const updateEmailSequence = async ({ body, id }: any) => {
  return http().post(URL.putEmailSequence.replace(':id', id), body);
};

export const deleteEmailSequence = async (id: any) => {
  return http().delete(URL.putEmailSequence.replace(':id', id));
};

export const runCampaignApi = async (id: number) => {
  return http().post(URL.emailCampaign + id + '/run-campaign-new/', {});
};

export const runSequenceCampaignApi = async (id: number) => {
  return http().post(URL.sequenceCampaign + id + '/run/', {});
};

export const deleteCampaignApi = async (id: number) => {
  return http().delete(URL.emailCampaign + id + '/');
};

export const deleteSequenceCampaignApi = async (id: number) => {
  return http().delete(URL.sequenceCampaign + id + '/');
};

export const getCampaignByIdApi = async (id: string): Promise<ICampaingnList> => {
  return http().get(URL.emailCampaign + id + '/');
};

export const getSequenceCampaignByIdApi = async (id: string): Promise<ICampaingnList> => {
  return http().get(URL.sequenceCampaign + id + '/');
};

export const getSequenceByCampaignId = async (id: string): Promise<ICommmonList<any>> => {
  return http().get(URL.sequenceCampaign + id + '/email-sequences/');
};

export const patchCampaignApi = async (req: { id: string; body: any }) => {
  return http().patch(URL.emailCampaign + req.id + '/', req.body);
};

export const patchSequenceCampaignApi = async (req: { id: string; body: any }) => {
  return http().patch(URL.sequenceCampaign + req.id + '/', req.body);
};

export const testCampaign = (id: string) => {
  return http().post('/email-campaign/:id/test-email-prompts/'.replace(':id', id), null);
};
