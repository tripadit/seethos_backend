import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const onBoardInfoSchema = z.object({
  company_name: z.string().optional(),
  contact_no: z.string().optional(),
  company_logo: z.any(),
  company_sector: z.string().optional(),
  company_size: z.string().optional(),
  company_description: z.string().optional(),
  ideal_customer_profile: z.string().optional(),
});

export function useAddOnboardInfo() {
  const { toast } = useToast();

  const addBot = (postData: z.infer<typeof onBoardInfoSchema>) => {
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
    const updatedEndpoints = endpoints.chatbot;
    return http('multipart').post(updatedEndpoints, formData);
  };

  return useMutation(addBot, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while adding the info!'}`,
        description: 'Please try again later.',
      });
    },
  });
}
