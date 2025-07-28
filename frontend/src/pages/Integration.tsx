import { zodResolver } from '@hookform/resolvers/zod';
import domtoimage from 'dom-to-image';
import { CopyIcon, DownloadIcon, EyeIcon, Loader2, RocketIcon, WrenchIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { AddReviewDialog, PreviewChatBotDialog } from '@/components/dialog';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { PageHeader } from '@/components/molecules';
import { CounterInput, CounterTextArea } from '@/components/molecules/CounterInput';
import ReviewCard from '@/components/molecules/ReviewCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { CONFIG } from '@/global/config.ts';
import { useFetchChatbot, useUpdateBot } from '@/hooks/api';
import { useFetchReview } from '@/hooks/api/review';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';

const IntegrationPage = ({ id }: { id?: string | null }) => {
  const { toast } = useToast();
  const qrRef = useRef<any>(null);
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const params = useParams();
  const navigate = useNavigate();
  const [reviewId, setReviewId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  const { status: botUpdateStatus, mutate: updateBotFn } = useUpdateBot();
  const {
    isLoading: reviewsLoading,
    data: reviews,
    refetch: refetchReviews,
  } = useFetchReview(id || (params.id as string));

  const { data: chatBotDetail, isLoading: isDetailLoading } = useFetchChatbot(
    id || params?.id || '',
    {
      onSuccess: (data: any) => {
        form.reset({
          landing_page_headline:
            data?.landing_page_headline == null || data?.landing_page_headline == 'null'
              ? ''
              : data?.landing_page_headline,
          landing_page_subheadline:
            data?.landing_page_subheadline == null || data?.landing_page_subheadline == 'null'
              ? ''
              : data?.landing_page_subheadline,
          cta_button_label:
            data?.cta_button_label && data?.cta_button_label === 'null'
              ? ''
              : data?.cta_button_label,
        });
      },
    },
  );
  const botDetailSchema = z.object({
    landing_page_headline: z
      .string({ required_error: 'Headline is required' })
      .nonempty({ message: 'Headline is required' }),
    landing_page_subheadline: z
      .string({ required_error: 'Subheadline is required' })
      .nonempty({ message: 'Subheadline is required' }),
    cta_button_label: z.string().optional(),
  });

  const form = useForm<z.infer<typeof botDetailSchema>>({
    resolver: zodResolver(botDetailSchema),
    defaultValues: {
      landing_page_headline:
        chatBotDetail?.landing_page_headline === null ||
        chatBotDetail?.landing_page_headline === 'null'
          ? ''
          : chatBotDetail?.landing_page_headline,
      landing_page_subheadline: chatBotDetail?.landing_page_subheadline,
      cta_button_label: chatBotDetail?.cta_button_label || 'Book an appointment',
    },
  });

  const getChatBotEmbedCode = useCallback(
    (type?: string) => {
      const baseURL =
        window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
      if (chatBotDetail && type) {
        return `<script src="${baseURL}/bot/embed.js" data-BotId='${chatBotDetail.bot_id}' bot-type='${type}'></script>`;
      }
      if (chatBotDetail) {
        return `
            <duality-chat-bot
              chatBotId="${chatBotDetail.bot_id}"
              layoutType="default"
              theme="light"
            />
            <script
              type="module"
              src="${CONFIG.BASE_API_URL}/bot_info/get_chatbot_js/"
            ></script>
          `;
      }
    },
    [chatBotDetail],
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
      .catch();
  };

  const handleToogleModal = () => {
    setIsOpen(!isOpen);
  };
  const handleToogleReviewModal = () => {
    setIsReviewOpen(!isReviewOpen);
  };

  const downloadQR = () => {
    domtoimage.toBlob(qrRef?.current).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chatBotDetail?.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleCopyLink = async (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
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

  const onSubmit = async (data: z.infer<typeof botDetailSchema>) => {
    const req = {
      ...chatBotDetail,
      ...data,
    };
    delete req.avatar;
    delete req.company_logo;
    updateBotFn(req, {
      onSuccess: () => {
        setEditEnabled(false);
        toast({
          variant: 'success',
          title: 'Landing page information updated successfully!',
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Error occured while updating landing page information!',
          description: 'Please try again later',
        });
      },
    });
  };

  const toggleEditMode = () => {
    setEditEnabled(!editEnabled);
  };

  return (
    <div>
      {isDetailLoading && !chatBotDetail && (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {!isDetailLoading && chatBotDetail && (
        <>
          <PageHeader
            title="Integration Page"
            isChildPage
            onBackPress={() => navigate(routes.dashboard)}
          >
            {chatBotDetail.bot_id && chatBotDetail.bot_id !== 'none' && (
              <Button
                variant={'purple'}
                onClick={handleToogleModal}
                disabled={!getChatBotEmbedCode()}
              >
                <EyeIcon />
                Preview Agent
              </Button>
            )}
          </PageHeader>
          <div className="flex flex-row gap-20 mb-20 2xl:gap-[160px]">
            {/* left part */}
            <div className="flex flex-col flex-1 2xl:flex-none  gap-10 2xl:max-w-[776px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold">Content</h4>
                    <p
                      className="text-sm font-semibold text-[#AC31F8] cursor-pointer"
                      onClick={() => checkAccount(() => toggleEditMode())}
                    >
                      {editEnabled ? 'Cancel Edit' : 'Edit'}
                    </p>
                  </div>
                  {/* Landing page  headline */}
                  <FormField
                    control={form.control}
                    name="landing_page_headline"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-[170px_1fr] ">
                        <FormLabel className="min-w-170">Headline</FormLabel>
                        <div className="m-0  w-full">
                          <FormControl>
                            <CounterInput
                              placeholder="Elevating Your Online Presence!"
                              charLimit={70}
                              className="w-full"
                              {...field}
                              disabled={!editEnabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Landing page sub headline */}
                  <FormField
                    control={form.control}
                    name="landing_page_subheadline"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-[170px_1fr]">
                        <FormLabel className="min-w-170">Sub-headline</FormLabel>
                        <div className="m-0  w-full">
                          <FormControl>
                            <CounterTextArea
                              defaultValue=""
                              placeholder="Are you ready to unlock the full potential of your brand in the digital sphere? Look no further!"
                              className="m-0 w-full h-32 placeholder:text-gray-300"
                              charLimit={250}
                              {...field}
                              disabled={!editEnabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* CTA Button sLabel */}
                  <FormField
                    control={form.control}
                    name="cta_button_label"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-[170px_1fr]">
                        <FormLabel className="min-w-170">CTA Button Label</FormLabel>
                        <div className=" w-full">
                          <FormControl>
                            <CounterInput
                              placeholder="Book an appointment"
                              charLimit={50}
                              className="w-full"
                              {...field}
                              disabled={!editEnabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="purple"
                    type="submit"
                    isLoading={botUpdateStatus === 'loading'}
                    className={cn('w-max mx-auto', { hidden: !editEnabled })}
                    disabled={!editEnabled}
                  >
                    Save
                  </Button>
                </form>
              </Form>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold">Your reviews</h4>
                  <p
                    className="text-sm font-semibold text-[#AC31F8] cursor-pointer"
                    onClick={() =>
                      checkAccount(() => {
                        setReviewId(undefined);
                        handleToogleReviewModal();
                      })
                    }
                  >
                    Add Review
                  </p>
                </div>

                {reviewsLoading && (
                  <div className="flex gap-4 flex-col items-center">
                    <Loader2 className="animate-spin w-8 h-8" />
                    <p>Loading...</p>
                  </div>
                )}

                {!reviewsLoading && reviews && (
                  <div className="grid grid-cols-2 gap-4">
                    {reviews.map((review: any, idx: number) => (
                      <ReviewCard
                        {...review}
                        key={idx}
                        refetch={refetchReviews}
                        onClick={() => {
                          setReviewId(review.id);
                          handleToogleReviewModal();
                        }}
                      />
                    ))}
                  </div>
                )}
                {!reviewsLoading && reviews && !reviews.length && (
                  <div className="flex gap-4 flex-col items-center">
                    <p>No reviews found</p>
                    <Button variant="purple" className="w-max" onClick={handleToogleReviewModal}>
                      Add Review
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* right part */}
            <div className="flex flex-col flex-1 2xl:flex-none gap-4 2xl:max-w-[776px]">
              {chatBotDetail.bot_id && chatBotDetail.bot_id !== 'none' && (
                <>
                  <div className="grid grid-cols-5">
                    <div className="col-span-1">
                      <p className="text-gray-700 font-medium text-sm">Status: </p>
                    </div>
                    <div className="col-span-4">
                      {chatBotDetail?.status && (
                        <div className="flex flex-row gap-4 items-center">
                          <span className="text-gray-500  font-bold text-sm">Active</span>{' '}
                        </div>
                      )}
                      {!chatBotDetail?.status && (
                        <div className="flex flex-row gap-4 items-center">
                          <span className="text-gray-500  font-bold text-sm">Inactive</span>{' '}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-5">
                    <div className="col-span-1">
                      <p className="text-gray-700 font-medium text-sm">Embed Code</p>
                    </div>
                    <div className="col-span-4 gap-4 grid">
                      <p className="text-sm font-medium text-gray-500">
                        Copy this HTML code and paste it into your website, CMS or wherever you want
                        our AI Agent.
                      </p>
                      <Textarea
                        placeholder="Copy code"
                        value={getChatBotEmbedCode()}
                        disabled
                        className="m-0  h-[350px]"
                      />
                      <div className="flex gap-3">
                        <Button variant="purple" onClick={handleCopyCode} className="w-fit">
                          <CopyIcon />
                          Copy Code
                        </Button>
                        <a
                          href={`https://${chatBotDetail?.bot_id}.${CONFIG.BOT_DOMAIN}/home`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant={'purple'}
                            className="w-fit"
                            onClick={() =>
                              handleCopyLink(
                                `https://${chatBotDetail?.bot_id}.${CONFIG.BOT_DOMAIN}/home`,
                              )
                            }
                          >
                            <RocketIcon />
                            Launch
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>

                  <Card className="shadow-xl border-none">
                    <CardContent className="p-5">
                      <div className="flex flex-row gap-8 ">
                        <div className="flex flex-col gap-4">
                          <div>
                            <h1 className="text-lg text-black font-semibold">
                              Don’t have a website?
                            </h1>
                            <h1 className="text-lg text-black font-semibold">
                              No worries, we got your covered.
                            </h1>
                          </div>
                          <p className="text-base font-normal text-gray-500">
                            Now you can use agent without having a website. Just use this QR code
                            and your clients can interact with your agent without the need of a
                            website
                          </p>
                        </div>
                        <div className="w-[250px] flex flex-col justify-center items-center gap-4">
                          {/* <img src={QRImage} className="h-[97px] w-[97px] object-contain" /> */}
                          <div ref={qrRef}>
                            <QRCode
                              value={`https://${chatBotDetail?.bot_id}.${CONFIG.BOT_DOMAIN}/home`}
                              className="h-[97px] w-[97px]"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant={'purple'} className="w-fit" onClick={downloadQR}>
                              <DownloadIcon />
                              Download
                            </Button>
                            <Button
                              variant={'purple'}
                              className="w-fit"
                              onClick={() =>
                                handleCopyLink(
                                  `https://${chatBotDetail?.bot_id}.${CONFIG.BOT_DOMAIN}/home`,
                                )
                              }
                            >
                              <CopyIcon />
                              Copy Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* no deployed bot case */}
              {chatBotDetail.bot_id && chatBotDetail.bot_id === 'none' && (
                <div className="flex flex-col gap-3 items-center mb-4">
                  <p className="text-gray-700 text-center">
                    We acknowledge that this agent has not been fully functional yet, please make
                    necessary changes and try again later.
                  </p>
                  <Button
                    variant={'purple'}
                    className="w-max"
                    onClick={() =>
                      navigate(
                        routes.addBot.replace(':id', (id as string) || (params.id as string)) +
                          `?mode=edit&id=${id || params.id}&tabIndex=details`,
                      )
                    }
                  >
                    <WrenchIcon />
                    Edit Agent
                  </Button>
                </div>
              )}
            </div>

            {/* <div className="flex flex-col gap-4 w-[514px]">
              <Card className="shadow-card100 border-none">
                <CardContent className="p-5 gap-4 flex flex-col">
                  <h1 className="text-black text-lg font-semibold">Code Embed Guide </h1>
                  <p className="text-base text-gray-500 font-normal">
                    Watch the video guide below on how to use the embedded code on your website to
                    launch the agent onto your website.
                  </p>
                  <div className="w-[474px] h-[309px] bg-gray-300 rounded-md"></div>
                  <p className="text-sm text-gray-700 font-medium">
                    Don’t have a website? No worries, we got your covered.{' '}
                    <a
                      href={`https://${chatBotDetail?.bot_id}.bots.unrealai.docker.junkirilabs.com/home`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-blue-500">click here</span>
                    </a>{' '}
                    to see agent without website
                  </p>
                </CardContent>
              </Card>
            </div> */}
            {/* <div className="flex">
              <p className="text-gray-500">Embed Iframe Code</p>
              <Textarea
                placeholder="Copy Iframe code"
                value={getChatBotEmbedCode()}
                disabled
                className="m-0  h-32"
              />
            </div>
            <Button variant="purple" onClick={handleCopyCode}>
              Copy Code
            </Button> */}
          </div>
        </>
      )}

      {isOpen && (
        <PreviewChatBotDialog
          isOpen={isOpen}
          chatBotDetail={chatBotDetail}
          onClose={handleToogleModal}
          script={getChatBotEmbedCode('dialog')}
        />
      )}

      <AddReviewDialog
        chatbot={chatBotDetail?.id}
        isOpen={isReviewOpen}
        reviewId={reviewId}
        onClose={() => {
          handleToogleReviewModal();
          refetchReviews();
        }}
      />
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
    </div>
  );
};

export default IntegrationPage;
