import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

import { addBotSchema } from '.';

export function useUpdateBot() {
  const { toast } = useToast();

  const updateBot = (postData: z.infer<typeof addBotSchema>) => {
    const formData = new FormData();
    Object.entries(postData).map(([key, val]: any) => {
      if (key === 'files') {
        val.forEach((element: number) => {
          formData.append('files', element.toString());
        });
        return;
      }
      if (key === 'company_logo') {
        formData.append('company_logo', postData.company_logo);
        return;
      }
      formData.append(key, val);
    });
    const updatedEndpoints = endpoints.chatBotDetail.replace(':id', postData?.id as string);
    return http('multipart').put(updatedEndpoints, formData);
  };

  return useMutation(updateBot, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while updating agent!'}`,
        description: 'Please try again later.',
      });
    },
  });
}
