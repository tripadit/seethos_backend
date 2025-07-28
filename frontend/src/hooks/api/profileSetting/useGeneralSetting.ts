import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const generalSettingSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }).email('Invalid email address.'),
  full_name: z
    .string({ required_error: 'Full Name is required.' })
    .nonempty('Full Name is required.'),
  date_joined: z.string().optional(),
  company_name: z
    .string({ required_error: 'Company Name is required.' })
    .nonempty('Company Name is required.'),
  phone: z
    .string()
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, 'Invalid phone number.')
    .nullable()
    .optional(),
  company_logo: z.any().optional(),
  company_sector: z.string().optional(),
  company_size: z.string().optional(),
  company_description: z.string().optional(),
  city: z.string({ required_error: 'City is required.' }).optional(),
  state: z.string({ required_error: 'State is required.' }).optional(),
  timezone: z.string({ required_error: 'Timezone is required.' }).optional(),
  address: z.string().optional(),
  country: z.string({ required_error: 'Country is required.' }).optional(),
  ideal_customer_profile: z.string().optional(),
});

export function useGeneralSetting() {
  const { toast } = useToast();

  const updateAccountInfo = (postData: z.infer<typeof generalSettingSchema>) => {
    const updatedEndpoints = endpoints.auth.me;
    const formData = new FormData();
    Object.entries(postData).map(([key, val]: any) => {
      if (key === 'company_logo') {
        formData.append('company_logo', postData.company_logo);
        return;
      }
      formData.append(key, val);
    });

    return http('multipart').post(updatedEndpoints, formData);
  };

  return useMutation(updateAccountInfo, {
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Account updated successfully!',
      });
    },
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },
  });
}
