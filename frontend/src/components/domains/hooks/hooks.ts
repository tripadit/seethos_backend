import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';

import { addDomainApi, deleteDomain, getAllDomainsApi, getDomainById } from '../api/domains';

export const useGetAllDomains = () => {
  return useQuery({
    queryKey: ['GET_ALL_DOMAINS'],
    queryFn: getAllDomainsApi,
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to get domains.',
      });
    },
  });
};

export const useAddDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDomainApi,
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_ALL_DOMAINS']);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to add domain.',
      });
    },
  });
};

export const useDeleteDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDomain,
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_ALL_DOMAINS']);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete domain.',
      });
    },
  });
};

export const useGetDomainById = (id?: string, enable: boolean = true) => {
  return useQuery({
    enabled: !!id && enable,
    queryKey: ['GET_DOMAIN_BY_ID', id],
    queryFn: () => getDomainById(id!),
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to get domain.',
      });
    },
  });
};
