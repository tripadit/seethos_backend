import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useUpdateUser(rest: any = {}) {
  const { toast } = useToast();

  const updateUser = (data?: any) => {
    const formData = new FormData();
    Object.entries(data).map(([key, val]: any) => {
      if (key === 'company_logo') {
        formData.append('company_logo', data.company_logo);
        return;
      }
      formData.append(key, val);
    });
    const updatedEndpoints = endpoints.auth.me;
    return http('multipart').post(updatedEndpoints, formData);
  };

  return useMutation(updateUser, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
    queryKey: ['updateChatBot'],
    ...rest,
  });
}
