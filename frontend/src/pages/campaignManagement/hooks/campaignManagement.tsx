import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';
import http from '@/utils/http';

import {
  createCampaignApi,
  createEmailSequence,
  createSenderEmailApi,
  createSequenceCampaignApi,
  deleteCampaignApi,
  deleteEmailSequence,
  deleteSenderEmailApi,
  deleteSequenceCampaignApi,
  getCampaignByIdApi,
  getCampignList,
  getSenderEmailListApi,
  getSequenceByCampaignId,
  getSequenceCampaignByIdApi,
  getSequenceCampaignList,
  patchCampaignApi,
  patchSequenceCampaignApi,
  runCampaignApi,
  runSequenceCampaignApi,
  testCampaign,
  updateEmailSequence,
} from '../api/campaignManagement';
import { query } from '../constant/query';
import { CampaignType } from '../types/campaingn';

export const useCompaignMangementList = () => {
  return useQuery({
    queryFn: getCampignList,
    queryKey: [query.getCampignList],
  });
};

export const useGetSequenceCampaignList = () => {
  return useQuery({
    queryFn: getSequenceCampaignList,
    queryKey: [query.getCampignList, query.getSequenceCampaignList],
  });
};

export const useGetSenderEmailList = () => {
  return useQuery({
    queryFn: getSenderEmailListApi,
    queryKey: [query.getSenderEmailList],
  });
};

export const useDeleteSenderEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSenderEmailApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete sender email.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [query.getSenderEmailList],
      });
      toast({
        variant: 'success',
        title: 'Sender email deleted successfully.',
      });
    },
  });
};
export const useCreateSenderEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSenderEmailApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to add sender email.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [query.getSenderEmailList],
      });
      toast({
        variant: 'success',
        title: 'Sender email addded successfully.',
      });
    },
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to create campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leadList']);
      toast({
        variant: 'success',
        title: 'Campaign created successfully.',
      });
    },
  });
};

export const useCreateSequenceCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSequenceCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to create campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leadList']);
      toast({
        variant: 'success',
        title: 'Campaign created successfully.',
      });
    },
  });
};

export const useRunCampaign = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: runCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to run campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leadList']);
      toast({
        variant: 'success',
        title: 'Campaign started successfully.',
      });
      onSuccess && onSuccess();
    },
  });
};

export const useRunSequenceCampaign = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: runSequenceCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to run campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leadList']);
      toast({
        variant: 'success',
        title: 'Campaign started successfully.',
      });
      onSuccess && onSuccess();
    },
  });
};

export const useTestEmailCampaignEmail = () => {
  return useMutation({
    mutationFn: testCampaign,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to test campaign.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Generating Sample Emails.',
      });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [query.getCampignList],
      });
      toast({
        variant: 'success',
        title: 'Campaign deleted successfully.',
      });
    },
  });
};

export const useDeleteSequenceCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSequenceCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [query.getCampignList],
      });
      toast({
        variant: 'success',
        title: 'Campaign deleted successfully.',
      });
    },
  });
};

export const useFetchCampaignById = (id?: string, enabled?: boolean, refetchInterval?: number) => {
  return useQuery(['campaign', query.getCampaignById, id], {
    enabled: enabled && !!id,
    refetchInterval,
    queryFn: () => getCampaignByIdApi(id || ''),
  });
};

export const useFetchSequenceCampaignById = (
  id?: string,
  enabled?: boolean,
  refetchInterval?: number,
) => {
  return useQuery(['campaign', query.getCampaignById, id], {
    enabled: enabled && !!id,
    refetchInterval,
    queryFn: () => getSequenceCampaignByIdApi(id || ''),
  });
};

export const useFetchSequenceByCampaignId = (id?: string, enabled?: boolean) => {
  return useQuery(['sequence', id], {
    enabled: enabled && !!id,
    queryFn: () => getSequenceByCampaignId(id || ''),
  });
};

export const useCreateSequenceMutation = () => {
  return useMutation({
    mutationFn: createEmailSequence,
  });
};

export const useUpdateSequenceMutation = () => {
  return useMutation({
    mutationFn: updateEmailSequence,
  });
};

export const useDeleteSequenceMutation = () => {
  return useMutation({
    mutationFn: deleteEmailSequence,
  });
};

export const usePatchCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to update campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaign', query.getCampaignById]);
      toast({
        variant: 'success',
        title: 'Campaign updated successfully.',
      });
    },
  });
};

export const usePatchSequenceCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchSequenceCampaignApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to update campaign.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaign', query.getCampaignById]);
      toast({
        variant: 'success',
        title: 'Campaign updated successfully.',
      });
    },
  });
};

export const useGetEmailCampaignStats = (id?: number, type?: CampaignType) => {
  const getCampaignStats = () => {
    let url = '';

    switch (type) {
      case CampaignType.SEQUENCE:
        url = `/sequence-campaign/${id}/stats/`;
        break;
      case CampaignType.EMAIL:
        url = `/email-campaign/${id}/stats/`;
        break;
      case CampaignType.NEWSLETTER:
        url = `/newsletter-campaign/${id}/stats/`;
        break;
      default:
        throw new Error('Invalid campaign type');
    }
    return http().get(url);
  };

  return useQuery({
    queryFn: getCampaignStats,
    queryKey: ['campaignStats', type, id],
    enabled: !!id && !!type,
  });
};

export const useGetAllEmailCampaignStats = (type?: CampaignType) => {
  const getCampaignStats = () => {
    let url = '';
    switch (type) {
      case CampaignType.SEQUENCE:
        url = `/sequence-campaign/all-stats/`;
        break;
      case CampaignType.EMAIL:
        url = `/email-campaign/all-stats/`;
        break;
      case CampaignType.NEWSLETTER:
        url = `/newsletter-campaign/all-stats/`;
        break;
      default:
        throw new Error('Invalid campaign type');
    }
    return http().get(url);
  };

  return useQuery({
    queryFn: getCampaignStats,
    queryKey: ['campaignStats', type],
    enabled: !!type,
  });
};
