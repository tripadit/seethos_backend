import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { CONVERSATION_START } from '@/global/appConstants';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export const addBotSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({
      required_error: 'Bot name is required.',
    })
    .min(1, 'Bot name is required.')
    .max(50),
  greeting_message: z.string({
    required_error: 'Greeting Message is required',
  }),
  company_name: z
    .string({
      required_error: 'Company name is required.',
    })
    .min(1, 'Company name is required.')
    .max(50),
  status: z.boolean(),
  greeting_tags: z.array(z.string()).optional(),
  question: z.array(z.string()).optional(),
  suggestive_tags: z.array(z.string()).optional(),
  avatar: z.any(),
  company_logo: z.any(),
  conversation_start_flow: z.string().optional().default(CONVERSATION_START[0]),
  conversation_end_flow: z.string().optional(),
  call_to_action_link: z
    .string({
      required_error: 'Call to action link is required.',
    })
    .nonempty('Call to action link is required.'),
  call_to_action_prompt: z.string().optional(),
  files: z.array(z.number().optional()).optional().default([]),
  agent_role: z
    .string({
      required_error: 'Agent role is required.',
    })
    .nonempty('Agent role is required.'),
});

export function useAddBot() {
  const { toast } = useToast();

  const addBot = (postData: z.infer<typeof addBotSchema>) => {
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
        title: `${error?.error || 'Error occured while adding the bot!'}`,
        description: 'Please try again later.',
      });
    },
  });
}
