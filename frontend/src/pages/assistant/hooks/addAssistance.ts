import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { toast } from '@/components/ui/use-toast';
import { routes } from '@/routes/routes';
import { appQuery } from '@/utils/constant/appQuery';
import queryClient from '@/utils/queryClient';

import {
  addAssistantSitemapApi,
  createAssistantApi,
  deleteTraningFileApi,
  deployAssistantApi,
  getAssistantAvatars,
  getAssistantDetailApi,
  getAssistantNames,
  scrapeSiteMapApi,
  updateAssistantApi,
  updateAssistantDataApi,
  updateUserApi,
  uploadTraningFileApi,
} from '../api/addAssistance';
import { query } from '../constant/query';
import { IUploadFile } from '../types/addAssistance';

export const useUpdateCompanyDetails = (isDirectClose?: boolean) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateUserApi,
    onError: () => {
      if (!isDirectClose) {
        toast({
          variant: 'destructive',
          title: 'Failed to update company details.',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [appQuery.getUserProfile],
      });
      if (!isDirectClose) {
        navigate(routes.addAssistance);

        toast({
          variant: 'success',
          title: 'Company details updated successfully.',
        });
      }
    },
  });
};

export const useScrapSiteMapData = () => {
  return useMutation({
    mutationFn: scrapeSiteMapApi,
  });
};

export const useUploadTraningFile = (onSuccess: (file: IUploadFile) => void) => {
  return useMutation({
    mutationFn: uploadTraningFileApi,
    onSuccess: onSuccess,
  });
};

export const useDeleteTraningFile = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: deleteTraningFileApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete the file.',
      });
    },
    onSuccess: () => {
      onSuccess();
      toast({
        variant: 'success',
        title: 'File deleted successfully.',
      });
    },
  });
};

export const useGetAssistantDetail = ({ id, enabled }: { id: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: [query.getAssistantDetails, { id: id }],
    queryFn: getAssistantDetailApi,
    enabled: enabled,
  });
};

export const useDeployAssistant = () => {
  return useMutation({
    mutationFn: deployAssistantApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to deploy assistant.',
      });
    },
  });
};

export const useAddAssistantSitemap = () => {
  return useMutation({
    mutationFn: addAssistantSitemapApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to add sitemap.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Sitemap added successfully.',
      });
    },
  });
};

export const useCreateAssistant = () => {
  return useMutation({
    mutationFn: createAssistantApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to create assistant.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Assistant created successfully.',
      });
    },
  });
};

export const useUpdateAssistant = () => {
  return useMutation({
    mutationFn: updateAssistantApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to update assistant.',
      });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Assistant updated successfully.',
      });
    },
  });
};

export const useUpdateAssistantData = (onSuccess: (args: any) => void) => {
  return useMutation({
    mutationFn: updateAssistantDataApi,
    onSuccess: onSuccess,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to update assistant.',
      });
    },
  });
};

export const useGenerateAssistantNames = (
  onSuccess?: (args: any) => void,
  onError?: () => void,
) => {
  return useMutation({
    mutationFn: getAssistantNames,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export function useGetAssistantAvatars(onSuccess?: (args: any) => void, onError?: () => void) {
  return useMutation({
    mutationFn: getAssistantAvatars,
    onSuccess: onSuccess,
    onError: onError,
  });
}
