import {
  Check,
  DownloadIcon,
  EyeIcon,
  Loader2,
  Pen,
  RocketIcon,
  RotateCcwIcon,
  Trash,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AddIcon, DeleteIcon, FileIcon, PencilIcon } from '@/assets/icons';
import { AddFileDialog, DeleteSiteMapDialog, PreviewChatBotDialog } from '@/components/dialog';
import AddSitemapDialog from '@/components/dialog/AddSiteMapDialog';
import FetchSitemapDialog from '@/components/dialog/FetchSitemapDialog';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { CTooltip, PageHeader } from '@/components/molecules';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { CONFIG } from '@/global/config.ts';
import {
  useDeleteSiteMap,
  useFetchChatBot,
  useFetchSiteMapByBotId,
  useUpdateChatBot,
  useUpdateSitemap,
} from '@/hooks/api';
import { useDeleteFile } from '@/hooks/api/useDeleteFile';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import {
  cn,
  convertBytes,
  convertDateStringToFormattedDate,
  ensureHTTPS,
  getAbbreviation,
} from '@/lib/utils';
import { routes } from '@/routes/routes';
import queryClient from '@/utils/queryClient';

const TrainingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const [botPreviewDetail, setBotPreviewDetail] = useState<any>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState<boolean>(false);
  const [siteMapLinks, setSiteMapLinks] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [botId, setBotId] = useState<string>('');
  const [siteMapURL, setSiteMapURL] = useState<string>('');
  const [trainingLinks, setTrainingLinks] = useState<string[]>([]);
  const [fetchSitemap, setIsFetchSitemap] = useState<boolean>(false);
  const { status, mutate: deleteFn } = useDeleteSiteMap();
  const { data: chatBotDetail, isLoading, refetch: refetchChatBotDetail } = useFetchChatBot('');
  const { isLoading: isDeletingFile, mutateAsync: deleteFileFn } = useDeleteFile();
  const { data: siteMapData, isLoading: isSiteMapLoading, refetch } = useFetchSiteMapByBotId(botId);
  const [postData, setPostData] = useState<any[]>([]);
  const { isLoading: isUpdateLoading, mutate: updateSiteMapFn } = useUpdateSitemap();
  const { status: updateStatus, mutate: updateChatbotFn } = useUpdateChatBot();

  useEffect(() => {
    if (siteMapData) {
      setPostData([...siteMapData]);
    }
  }, [siteMapData]);

  const getFiles = (id: string) => {
    if (chatBotDetail?.data) {
      const bot = chatBotDetail.data.filter((data: any) => data.id === id);
      return bot[0]?.file;
    } else {
      return [];
    }
  };

  const getChatbotDetail = (id: string) => {
    if (chatBotDetail?.data) {
      const bot = chatBotDetail.data.filter((data: any) => data.id === id);
      return bot[0];
    } else {
      return {};
    }
  };

  const getChatBotEmbedCode = useCallback(
    (botID: string, type?: string) => {
      const baseURL =
        window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
      if (chatBotDetail && type) {
        return `<script src="${baseURL}/bot/embed.js" data-BotId='${botID}' bot-type='${type}'></script>`;
      }
      if (chatBotDetail) {
        return `<html>
          <head>
            <script
              type="module"
              src="/src/ai-assistant-component.js"
            ></script>
          </head>
          <body>
            <duality-chat-bot
              chatBotId="${botID}"
              layoutType="screen"
            />
          </body>
        </html>`;
      }
    },
    [chatBotDetail],
  );

  const toggleDialog = () => {
    setSelected('');
    setIsOpen(!isOpen);
  };

  const toggleAddDialog = () => {
    refetchChatBotDetail();
    setIsAddModalOpen(!isAddModalOpen);
  };

  const toggleAddFileDialog = () => {
    setIsAddFileModalOpen(!isAddFileModalOpen);
  };

  const toggleSiteMapDialog = () => {
    setIsFetchSitemap(!fetchSitemap);
  };

  const hasTrainingLinkChanged = useCallback((originalSiteMapData: any, postData: any) => {
    // Convert both originalSiteMapData and postData to JSON strings for comparison
    const originalJSON = JSON.stringify(originalSiteMapData);
    const updatedJSON = JSON.stringify(postData);

    // Check if there's any difference between the two JSON strings
    const hasChanged = originalJSON !== updatedJSON;

    return hasChanged;
  }, []);

  const handleSiteMapClick = (sitemapId: string, link: string) => {
    setPostData((prevPostData) => {
      const updatedPostData = JSON.parse(JSON.stringify(prevPostData));
      const sitemapToUpdate = updatedPostData.find((item: any) => item.id === sitemapId);

      if (sitemapToUpdate) {
        const index = sitemapToUpdate.traning_links.indexOf(link);
        if (index !== -1) {
          sitemapToUpdate.traning_links.splice(index, 1);
        } else {
          sitemapToUpdate.traning_links.push(link);
        }
      }

      return updatedPostData;
    });
  };

  const handleTooglePreviewModal = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const getVariants = (data: any) => {
    switch (data?.traning_status) {
      case 'UNTRAINED':
        return 'destructive';
      case 'TRAINING':
        return 'warning';
      case 'TRAINED':
        return 'success';
      default:
        return 'destructive';
    }
  };

  const handleDeleteRow = (id: string) => {
    if (id) {
      deleteFn(id, {
        onSuccess: () => {
          updateChatbotFn(botId, {
            onSuccess: () => {
              refetch();
              toast({
                variant: 'success',
                title: 'Sitemap updated successfully.',
              });
            },
          });
          setSelected('');
          toggleDialog();
        },
      });
    }
  };

  const handleUpdateSiteMap = () => {
    toast({
      variant: 'success',
      title: 'Updating sitemaps...',
    });
    postData.map((data, idx) => {
      updateSiteMapFn(
        {
          id: data.id,
          url: ensureHTTPS(data.url),
          traning_links: data.traning_links,
          chatbot: data.chatbot,
        },
        {
          onSuccess: () => {
            postData.length === idx + 1 &&
              updateChatbotFn(botId, {
                onSuccess: () => {
                  toast({
                    variant: 'success',
                    title: 'Sitemap updated successfully.',
                  });
                },
              });
          },
        },
      );
    });
    refetch();
    queryClient.invalidateQueries(['fetch', 'sitemap', 'bot', botId]);
  };

  const handleUpdateChatBot = () => {
    updateChatbotFn(botId, {
      onSuccess: () => {
        toast({
          variant: 'success',
          title: 'Bot is being re-trained in background.',
          description: 'Please wait while we train your bot.',
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Error occured while retraining bot.',
          description: 'Please try again.',
        });
      },
    });
  };

  return (
    <>
      <PageHeader title="Training" isLoading={isLoading}>
        <></>
      </PageHeader>
      {isLoading && (
        <>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
        </>
      )}
      {!isLoading && (
        <Accordion type="single" collapsible>
          <div className="flex flex-col gap-2.5">
            {!!chatBotDetail?.data.length &&
              chatBotDetail?.data.map((data: any, idx: number) => (
                <div key={idx}>
                  <AccordionItem value={`item-${idx + 1}`}>
                    <AccordionTrigger onClick={() => setBotId(data.id)}>
                      <div className="flex gap-2 items-center">
                        <Avatar className="bg-purple-100">
                          <AvatarImage src={data.avatar} />
                          <AvatarFallback>{getAbbreviation(data.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-lg font-semibold">{data.name}</h2>
                        </div>
                        {data?.traning_status && (
                          <Badge variant={getVariants(data)}>{data?.traning_status}</Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {isSiteMapLoading && (
                        <div className="flex gap-2 items-center justify-center">
                          <Loader2 className="animate-spin" />
                          <p>Loading...</p>
                        </div>
                      )}
                      {!isSiteMapLoading && (
                        <div className="grid grid-cols-[2fr_1fr] gap-6">
                          {/* Training Links */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h2 className="text-lg font-semibold">Training Links</h2>
                              <div className="flex gap-6">
                                {(data?.traning_status === 'TRAINING' ||
                                  data?.traning_status === 'UNTRAINED') && (
                                  <Button
                                    variant="secondary"
                                    onClick={() => checkAccount(() => handleUpdateChatBot())}
                                  >
                                    <RotateCcwIcon className="text-black" />
                                    Re-train
                                  </Button>
                                )}

                                {siteMapData &&
                                  !!siteMapData.length &&
                                  hasTrainingLinkChanged(siteMapData, postData) && (
                                    <Button
                                      variant="outline"
                                      isLoading={isUpdateLoading}
                                      onClick={() => checkAccount(() => handleUpdateSiteMap)}
                                      className="border-2 border-purple-500"
                                      disabled={isUpdateLoading || updateStatus === 'loading'}
                                    >
                                      {!isUpdateLoading && (
                                        <Check className="[&>path]:stroke-black" />
                                      )}
                                      Confirm Changes
                                    </Button>
                                  )}

                                <Button
                                  variant="purple"
                                  onClick={() => checkAccount(() => toggleAddDialog())}
                                >
                                  <AddIcon />
                                  Add Link
                                </Button>
                                {data?.bot_id !== 'none' && data?.bot_id && (
                                  <Button
                                    variant={'purple'}
                                    onClick={() => {
                                      setBotPreviewDetail(data);
                                      handleTooglePreviewModal();
                                    }}
                                    disabled={!getChatBotEmbedCode(data?.bot_id)}
                                  >
                                    <EyeIcon />
                                    Preview
                                  </Button>
                                )}
                                {data?.bot_id !== 'none' && data?.bot_id && (
                                  <Button
                                    variant={'purple'}
                                    className="w-fit"
                                    onClick={() =>
                                      window.open(
                                        `https://${data?.bot_id}.${CONFIG.BOT_DOMAIN}/home`,
                                        '_blank',
                                      )
                                    }
                                  >
                                    <RocketIcon />
                                    Launch
                                  </Button>
                                )}
                                <Button
                                  variant="warning"
                                  className="w-fit"
                                  onClick={() =>
                                    checkAccount(() =>
                                      navigate(
                                        routes.assistantDetail
                                          .replace(':id', data?.id)
                                          .replace(':tabType', 'details'),
                                      ),
                                    )
                                  }
                                >
                                  <Pen className="w-5 h-5 cursor-pointer" />
                                  Edit Agent
                                </Button>
                              </div>
                            </div>
                            {siteMapData && !!siteMapData.length && (
                              <Card className="py-2 px-4 ">
                                {siteMapData &&
                                  siteMapData.map((stData: any, idx: number) => (
                                    <div key={idx}>
                                      <div className="flex items-center gap-10 not:last:border-b">
                                        <div className="flex-1">
                                          <div className="flex gap-2 mb-1 items-center">
                                            <Checkbox
                                              checked
                                              className="bg-purple-100 border-purple-600 [&>span>svg]:stroke-purple-600"
                                            />
                                            <p>{stData.url}</p>
                                          </div>
                                          <div className="flex flex-col gap-1 ml-3">
                                            {stData.all_links &&
                                              stData.all_links.length &&
                                              stData.all_links.map((link: string, idx: number) => (
                                                <div className="flex gap-2 items-center" key={idx}>
                                                  <Checkbox
                                                    defaultChecked={stData.traning_links.includes(
                                                      link,
                                                    )}
                                                    onCheckedChange={() => {
                                                      handleSiteMapClick(stData.id, link);
                                                    }}
                                                    className={cn(
                                                      'bg-purple-100 border-purple-600 [&>span>svg]:stroke-purple-600',
                                                      {
                                                        'bg-yellow-100 border-yellow-600 [&>span>svg]:stroke-yellow-600':
                                                          !stData.traning_links.includes(link),
                                                      },
                                                    )}
                                                  />
                                                  <p>{link}</p>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                        <p>{convertDateStringToFormattedDate(stData.updated_at)}</p>
                                        <CTooltip text="Edit Sitemap">
                                          <Button
                                            className="px-4 py-1"
                                            variant="ghost"
                                            onClick={(e) =>
                                              checkAccount(() => {
                                                e.stopPropagation();
                                                setSelected(stData.id);
                                                setSiteMapURL(stData.url);
                                                setSiteMapLinks(stData.all_links);
                                                setTrainingLinks(stData.traning_links);
                                                toggleSiteMapDialog();
                                              })
                                            }
                                          >
                                            <PencilIcon className="cursor-pointer" />
                                          </Button>
                                        </CTooltip>
                                        <CTooltip text="Delete Sitemap">
                                          <Button
                                            className="px-4 py-1"
                                            variant="ghost"
                                            disabled={
                                              siteMapData &&
                                              siteMapData.length <= 1 &&
                                              getFiles(data.id).length <= 0
                                            }
                                            onClick={(e) =>
                                              checkAccount(() => {
                                                e.stopPropagation();
                                                setSelected(stData.id);
                                                setIsOpen(true);
                                              })
                                            }
                                          >
                                            <DeleteIcon className="cursor-pointer" />
                                          </Button>
                                        </CTooltip>
                                      </div>
                                      {siteMapData &&
                                        !!siteMapData.length &&
                                        idx + 1 !== siteMapData.length && (
                                          <Separator className="my-2" />
                                        )}
                                    </div>
                                  ))}
                              </Card>
                            )}
                            {siteMapData && !siteMapData.length && (
                              <div className="flex items-center justify-center my-5">
                                No training data available
                              </div>
                            )}
                          </div>

                          {/* Training Files */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h2 className="text-lg font-semibold">Training Files</h2>
                              <Button
                                variant="purple"
                                onClick={() => checkAccount(() => toggleAddFileDialog())}
                              >
                                <AddIcon />
                                Add
                              </Button>
                            </div>
                            {!!getFiles(data.id).length &&
                              getFiles(data.id).map((file: any, idx: number) => (
                                <Card className="p-4 flex items-center gap-2" key={idx}>
                                  <Checkbox />
                                  <FileIcon />
                                  <div className="flex items-end justify-between flex-1">
                                    <div>
                                      <h4>{file.name || `File ${idx + 1}`}</h4>
                                      <p>{convertDateStringToFormattedDate(file.updated_at)}</p>
                                    </div>
                                    <p>{convertBytes(file.size)}</p>
                                  </div>
                                  <a href={file.file} download>
                                    <Button variant={'ghost'}>
                                      <DownloadIcon className="[&>path]:stroke-gray-500 cursor-pointer" />
                                    </Button>
                                  </a>
                                  <Button
                                    variant={'ghost'}
                                    isLoading={selectedFile === file.id && isDeletingFile}
                                    disabled={
                                      isDeletingFile || (siteMapData && siteMapData.length <= 0)
                                    }
                                    onClick={(e) =>
                                      checkAccount(async () => {
                                        setSelectedFile(file.id);
                                        e.stopPropagation();
                                        await deleteFileFn(
                                          { id: file.id },
                                          {
                                            onSuccess: () => {
                                              refetchChatBotDetail();
                                              updateChatbotFn(botId, {
                                                onError: () => {
                                                  toast({
                                                    variant: 'success',
                                                    title:
                                                      'Error occured while updating bot with new training assets.',
                                                  });
                                                },
                                              });
                                            },
                                            onSettled: () => {
                                              setSelectedFile('');
                                            },
                                          },
                                        );
                                      })
                                    }
                                  >
                                    {selectedFile !== file.id && <Trash size={14} />}
                                  </Button>
                                </Card>
                              ))}
                            {getFiles(data.id) && !getFiles(data.id).length && (
                              <div className="flex items-center justify-center my-5">
                                No files found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
          </div>
        </Accordion>
      )}
      {!isLoading && !chatBotDetail?.data.length && (
        <div className="flex flex-col gap-5 items-center justify-center">
          <p className="text-gray-700">No agent available for training at the moment.</p>
          <CTooltip text="Create Bot">
            <Button
              className="capitalize bg-purple-500 text-white gap-3"
              onClick={() => navigate(routes.addAssistance)}
            >
              <AddIcon /> <p>Add an agent</p>
            </Button>
          </CTooltip>
        </div>
      )}
      <DeleteSiteMapDialog
        isOpen={isOpen}
        onClose={toggleDialog}
        actions={
          <>
            <Button variant="ghost" onClick={toggleDialog}>
              Cancel
            </Button>
            <Button
              variant="purple"
              onClick={() => handleDeleteRow(selected)}
              isLoading={status === 'loading' ? true : false}
            >
              Delete
            </Button>
          </>
        }
      />
      <AddSitemapDialog isOpen={isAddModalOpen} botId={botId} onClose={toggleAddDialog} />
      <AddFileDialog
        isOpen={isAddFileModalOpen}
        refetch={refetchChatBotDetail}
        chatbotDetail={getChatbotDetail(botId)}
        files={getFiles(botId)}
        botId={botId}
        onClose={toggleAddFileDialog}
      />
      <FetchSitemapDialog
        siteMapUrl={siteMapURL}
        trainingLinks={trainingLinks}
        setTrainingLinks={setTrainingLinks}
        siteMapLinks={siteMapLinks}
        setSiteMapLinks={setSiteMapLinks}
        isOpen={fetchSitemap}
        chatbotId={botId}
        siteMapId={selected}
        onClose={toggleSiteMapDialog}
        mode="edit"
        refetch={refetch}
      />
      {isPreviewOpen && (
        <PreviewChatBotDialog
          isOpen={isPreviewOpen}
          chatBotDetail={botPreviewDetail}
          onClose={handleTooglePreviewModal}
          script={getChatBotEmbedCode(botPreviewDetail?.bot_id, 'dialog')}
        />
      )}
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
    </>
  );
};

export default TrainingPage;
