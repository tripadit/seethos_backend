import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { toast, useToast } from '@/components/ui/use-toast';
import { ICommmonList } from '@/pages/campaignManagement/types/campaingn';
import http from '@/utils/http';

import {
  createCampaignForLeadList,
  deleteLeadById,
  deleteLeadList,
  generateLeads,
  getLeadsInLeadsList,
  patchLead,
  resendEmailToLead,
  sendEmailResponse,
  updateLeadListDetails,
} from '../api/leadGeneration';
import { ILead } from '../components/LeadListDetails/LeadListDetails';

export const useGenerateLeads = () => {
  return useMutation({
    mutationFn: generateLeads,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to generate leads.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Leads generation started.',
      });
    },
  });
};

export const useGetLeadsByLeadListId = () => {
  return useMutation({
    mutationFn: getLeadsInLeadsList,
    onError: () => {},
    onSuccess: () => {},
  });
};

const URL = {
  generateLeads: '/leadgen/',
  getLeadsInLeadsList: (leadId: number) => `/leadgen/${leadId}/get_leads/`,
  leadLists: '/leadgen/',
  lead: '/lead/',
};

export const useGetLeadsByListId = (
  listId?: number,
  isListCompleted: boolean = false,
  pagination?: PaginationState,
  search?: string,
  rest: any = {},
) => {
  const getLeadsInLeadsList = async (): Promise<any> => {
    return http().get(URL.getLeadsInLeadsList(listId!), {
      params: {
        page: pagination?.pageIndex,
        size: pagination?.pageSize,
        search,
      },
    });
  };

  return useQuery<ICommmonList<ILead>>(['leads', listId], getLeadsInLeadsList, {
    enabled: !!listId && !isListCompleted,
    refetchInterval: !isListCompleted ? 10000 : undefined,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching record!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
};

export const useGetLeadListDetails = (listId: string, rest: any = {}) => {
  const getLeadListDetails = async (): Promise<any> => {
    return http().get(`${URL.leadLists}${listId}/`);
  };
  return useQuery(['leadList', listId, 'fetch'], getLeadListDetails, {
    enabled: !!listId,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching record!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
};

export const useLazyGetLeadsByListId = () => {
  return useMutation({
    mutationFn: getLeadsInLeadsList,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching record!'}`,
        description: 'Please try again later.',
      });
    },
  });
};

export const useGetLeadsByEmailCampaignId = (
  emailCampaignId: any,
  enabled?: boolean,
  pagination?: PaginationState,
  search?: string,
  rest: any = {},
) => {
  const getLeadsByEmailCampaignId = async (emailCampaignId: any) => {
    return http().get(`/email-campaign/${emailCampaignId}/get_leads/`, {
      params: {
        page: pagination?.pageIndex || 1,
        page_size: pagination?.pageSize || 10,
        search,
      },
    });
  };
  return useQuery(['leads', emailCampaignId], () => getLeadsByEmailCampaignId(emailCampaignId), {
    ...rest,
    enabled: !!enabled,
  });
};

export const useGetLeadsBySequenceCampaignId = (
  emailCampaignId: any,
  enabled?: boolean,
  pagination?: PaginationState,
  search?: string,
  rest: any = {},
) => {
  const getLeadsByEmailCampaignId = async (emailCampaignId: any) => {
    return http().get(`/sequence-campaign/${emailCampaignId}/leads/`, {
      params: {
        page: pagination?.pageIndex || 1,
        page_size: pagination?.pageSize || 10,
        search,
      },
    });
  };
  return useQuery(['leads', emailCampaignId], () => getLeadsByEmailCampaignId(emailCampaignId), {
    ...rest,
    enabled: !!enabled,
  });
};

export const useLazyLeadsByEmailCampaignId = () => {
  return useMutation({
    mutationFn: (emailCampaignId: any) =>
      http().get(`/email-campaign/${emailCampaignId}/get_leads/`, {
        params: {
          page: 1,
          page_size: 500,
        },
      }),
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch leads.',
      });
    },
  });
};

export const useUpdateLeadListDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLeadListDetails,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to update lead list.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leadList']);
      toast({
        variant: 'success',
        title: 'Lead list updated successfully.',
      });
    },
  });
};

export const useResendEmailToLead = () => {
  return useMutation({
    mutationFn: resendEmailToLead,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to resend email.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Email set to be resent.',
      });
    },
  });
};

export const useGetLeadById = (id: string, rest: any = {}) => {
  const getLeadById = async (): Promise<any> => {
    return http().get(`${URL.lead}${id}/`);
  };

  return useQuery<ILead>(['lead', id, 'fetch'], getLeadById, {
    enabled: !!id,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching record!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
};

export const useGetEmailCampaignLeadById = (id: string, rest: any = {}) => {
  const getLeadById = async (): Promise<any> => {
    return http().get(`${URL.lead}${id}/get_email_campaign_lead/`);
  };

  return useQuery<ILead>(['lead', id, 'fetch'], getLeadById, {
    enabled: !!id,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching record!'}`,
        description: 'Please try again later.',
      });
    },
    ...rest,
  });
};

export const useGetLeadMailHistory = () => {
  const getLeadMailHistory = async (id: string): Promise<any> => {
    return http().get(`${URL.lead}${id}/get_email_body/`);
  };

  const queryClient = useQueryClient();

  return useMutation(['mailHistory', 'lead'], getLeadMailHistory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notification']);
    },
  });
};

export function useGetLeadLists(pagination?: PaginationState, search?: string, rest: any = {}) {
  const getLeadLists = async () => {
    return http().get(URL.leadLists, {
      params: {
        page: pagination?.pageIndex,
        size: pagination?.pageSize,
        search,
      },
    });
  };

  const { toast } = useToast();
  return useQuery(
    ['leadList', pagination?.pageIndex.toString(), pagination?.pageSize.toString(), search],
    getLeadLists,
    {
      onError: (error: { error?: string }) => {
        toast({
          variant: 'destructive',
          title: `${error?.error || 'Error occured while fetching record!'}`,
          description: 'Please try again later.',
        });
      },
      ...rest,
    },
  );
}

export function useDeleteLeadList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLeadList,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete lead list.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leadList']);
      toast({
        variant: 'success',
        title: 'Lead list deleted successfully.',
      });
    },
  });
}

export function useDeleteLeadById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLeadById,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete lead.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      toast({
        variant: 'success',
        title: 'Lead deleted successfully.',
      });
    },
  });
}

export function usePatchLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchLead,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to update lead.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lead']);
      toast({
        variant: 'success',
        title: 'Lead updated successfully.',
      });
    },
  });
}

export function useCreateCampaignForLeadList() {
  return useMutation({
    mutationFn: createCampaignForLeadList,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to create campaign.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Campaign created successfully.',
      });
    },
  });
}

export function useGetLeads(pagination?: PaginationState) {
  const getLeads = async () => {
    return http().get(URL.lead, {
      params: {
        page: pagination?.pageIndex,
        size: pagination?.pageSize,
      },
    });
  };

  return useQuery<ICommmonList<ILead>>(
    ['leads', pagination?.pageIndex.toString(), pagination?.pageSize.toString()],
    getLeads,
    {
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Failed to fetch leads.',
        });
      },
    },
  );
}

export function useSendEmailResponseToLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendEmailResponse,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to send email response.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mailHistory']);
      toast({
        variant: 'success',
        title: 'Email response sent successfully.',
      });
    },
  });
}
