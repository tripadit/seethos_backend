import { PaginationState } from '@tanstack/react-table';

import { ICommmonList } from '@/pages/campaignManagement/types/campaingn';
import http from '@/utils/http';

import { ILead } from '../components/LeadListDetails/LeadListDetails';

const URL = {
  generateLeads: '/leadgen/',
  getLeadsInLeadsList: (leadId: string) => `/leadgen/${leadId}/get_leads/`,
  leadLists: '/leadgen/',
  lead: '/lead/',
  createCampaignForLeadList: '/email-campaign/',
  resendEmailToLead: '/lead/:id/resend_email_by_lead_id/',
  emailBody: '/email-body/',
};

export const generateLeads = async (body: any): Promise<{ id: number }> => {
  return http().post(URL.generateLeads, body);
};

export const getLeadsInLeadsList = async (
  leadId: any,
  pagination?: PaginationState,
): Promise<ICommmonList<ILead>> => {
  return http().get(URL.getLeadsInLeadsList(leadId), {
    params: {
      page: pagination?.pageIndex || 1,
      size: pagination?.pageSize || 500,
    },
  });
};

export const updateLeadListDetails = async (req: any) => {
  return http().patch(`${URL.leadLists}${req.id}/`, req.body);
};

export const resendEmailToLead = async (id: string) => {
  return http().get(URL.resendEmailToLead.replace(':id', id));
};

export const deleteLeadList = async (id: string) => {
  return http().delete(`${URL.leadLists}${id}/`);
};

export const deleteLeadById = async (id: string) => {
  return http().delete(`${URL.lead}${id}/`);
};

export const patchLead = async (req: any) => {
  return http().patch(`${URL.lead}${req.id}/`, req.body);
};

export const createCampaignForLeadList = async (req: any) => {
  return http().post(URL.createCampaignForLeadList, req);
};

export const sendEmailResponse = async (req: any) => {
  return http().post(URL.emailBody, {
    ...req,
  });
};
