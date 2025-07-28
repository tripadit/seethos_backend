import clsx from 'clsx';
import { Copy, Eye } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { PreviewChatBotDialog } from '@/components/dialog';
import { PageHeader } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { CONFIG } from '@/global/config.ts';
import { useRouteQuery } from '@/hooks';
import { useFetchChatBot } from '@/hooks/api';

import { AssistantQRCard } from '../components/assistantIframe/assistantQRCard';
import { useFetchAssistantById } from '../hooks/addAssistantSuccess';
import { IAssistant } from '../types/addAssistantSuccess';

const AddAssistantSuccess = ({ id }: { id: string }) => {
  const [removeBanner, setRemoveBanner] = React.useState<boolean>(false);
  const [openPreviewAssistant, setOpenPreviewAssistant] = React.useState<boolean>(false);
  const edit = useRouteQuery('edit');
  const { data: chatBotDetail } = useFetchChatBot('');
  const { data, isLoading } = useFetchAssistantById({ id: id });

  const form = useForm<any>({
    defaultValues: React.useMemo(() => {
      return {
        status: data?.status,
      };
    }, [data]),
  });

  const getChatBotEmbedCode = React.useCallback(
    (type?: string) => {
      const baseURL =
        window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
      if (data && type) {
        return `<script src="${baseURL}/bot/embed.js" data-BotId='${data?.bot_id}' bot-type='${type}'></script>`;
      }
      if (data) {
        return `<duality-chat-bot chatBotId="${data?.bot_id}" layoutType="default" theme="light" />
        
      <script type="module" src="${CONFIG.BASE_API_URL}/bot_info/get_chatbot_js/">
      </script>`;
      }
    },
    [data],
  );

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(getChatBotEmbedCode() as string)
      .then(() =>
        toast({
          variant: 'success',
          title: 'Code copied to clipboard!',
        }),
      )
      .catch((err) => {
        throw new Error('Could not copy to clipboard: ' + err);
      });
  };
  return (
    <div className="mb-20">
      {!id && (
        <PageHeader
          tiltleClassName="pl-24"
          title="Create a new assistant"
          children={undefined}
          separatorClassName="mb-0"
        />
      )}
      {!removeBanner && !id && (
        <div className="w-full bg-purple-500 h-[56px] flex flex-row gap-10 lg:gap-20  items-center justify-center">
          <h1 className="text-lg font-semibold text-white ">
            Introducing Premium Feature: Boost Conversions with Custom Call-to-Action Links!
          </h1>
          <div className="flex flex-row gap-5 items-center">
            <Button className="bg-white" variant={'ghost'}>
              View Demo
            </Button>
            <Button
              className="bg-transparent border-white text-white hover:bg-white"
              variant={'outline'}
              onClick={() => {
                setRemoveBanner(true);
              }}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
      {!isLoading && (
        <div
          className={clsx(' flex flex-col  pr-8', {
            'pl-24 my-14': !id,
          })}
        >
          <div className="flex flex-row justify-center items-center w-full">
            {!id && (
              <div className="flex flex-col w-full max-w-[686px] gap-1">
                {!edit && (
                  <h1 className="text-2xl font-bold text-black/75 text-center">
                    {chatBotDetail?.data?.lenth <= 1
                      ? "Congrats you've created your First AI assistant."
                      : "Congrats you've created your AI assistant."}
                  </h1>
                )}
                {edit && (
                  <h1 className="text-2xl font-bold text-black/75 text-center">
                    Congrats you've updated your AI assistant.
                  </h1>
                )}
                <p className="text-gray-1000 text-base font-normal text-center">
                  You can copy the iframe code onto your website/CMS or if you don't have a website,
                  you can scan the QR code provided to use our personalized landing page for your
                  visitors.
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-10 mt-5">
            <div>
              <Form {...form}>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={() => (
                      <FormItem className="grid grid-cols-[170px_1fr] ">
                        <FormLabel className="min-w-170 text-sm">Assistant Status</FormLabel>
                        <div className="m-0  w-full flex flex-col gap-2">
                          <FormControl>
                            <div className="flex fle-row gap-2 items-center">
                              <h1 className="text-base font-medium">Inctive</h1>
                              <Switch checked={data?.status} />
                              <h1 className="text-base font-medium">Active</h1>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Landing page  headline */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={() => (
                      <FormItem className="grid grid-cols-[170px_1fr] ">
                        <FormLabel className="min-w-170 text-sm">Embed Iframe Code</FormLabel>
                        <div className="m-0  w-full flex flex-col gap-2">
                          <p className="text-[#4B5563] font-normal text-sm">
                            Copy this HTML code and paste it into your website, CMS or wherever you
                            want our AI assistant.
                          </p>
                          <FormControl>
                            <Textarea
                              placeholder="Copy code"
                              value={getChatBotEmbedCode()}
                              disabled
                              readOnly
                              className="m-0  h-[200px]"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-[#4B5563] font-normal text-sm">
                            Watch the video guide on how to use the embedded code on your website to
                            launch the assistant onto your website.{' '}
                            <span className="text-purple-500">Click here</span>
                          </p>
                          <div className="flex flex-row gap-4 items-center mt-4">
                            <Button
                              onClick={() => setOpenPreviewAssistant(true)}
                              className=""
                              variant={'purple'}
                              icon={<Eye />}
                            >
                              Preview Assistant
                            </Button>
                            <Button
                              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                              variant={'outline'}
                              icon={<Copy />}
                              onClick={handleCopyCode}
                            >
                              Copy Code
                            </Button>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </div>
            {!isLoading && <AssistantQRCard assistant={data as IAssistant} />}
          </div>
        </div>
      )}
      {openPreviewAssistant && (
        <PreviewChatBotDialog
          isOpen={openPreviewAssistant}
          chatBotDetail={data}
          onClose={() => {
            setOpenPreviewAssistant(false);
          }}
          script={getChatBotEmbedCode('dialog')}
        />
      )}
    </div>
  );
};
export default AddAssistantSuccess;
