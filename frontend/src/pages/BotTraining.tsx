import { Check, DownloadIcon, Pen, RocketIcon, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AddIcon, DeleteIcon, FileIcon, PencilIcon } from '@/assets/icons';
import { AddFileDialog, DeleteSiteMapDialog } from '@/components/dialog';
import AddSitemapDialog from '@/components/dialog/AddSiteMapDialog';
import FetchSitemapDialog from '@/components/dialog/FetchSitemapDialog';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { CTooltip, PageHeader } from '@/components/molecules';
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
  useFetchChatbot,
  useFetchSiteMapByBotId,
  useUpdateChatBot,
  useUpdateSitemap,
} from '@/hooks/api';
import { useDeleteFile } from '@/hooks/api/useDeleteFile';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { cn, convertBytes, convertDateStringToFormattedDate, ensureHTTPS } from '@/lib/utils';
import { routes } from '@/routes/routes';
import queryClient from '@/utils/queryClient';

interface IBotTrainingProps {
  botId: string;
}

const BotTraining = ({ botId }: IBotTrainingProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [postData, setPostData] = useState<any[]>([]);
  const [siteMapLinks, setSiteMapLinks] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState<boolean>(false);
  const [siteMapURL, setSiteMapURL] = useState<string>('');
  const [trainingLinks, setTrainingLinks] = useState<string[]>([]);
  const { status, mutate: deleteFn } = useDeleteSiteMap();
  const { data: chatBotDetail, isLoading, refetch: refetchChatBotDetail } = useFetchChatbot(botId);
  const { isLoading: isDeletingFile, mutateAsync: deleteFileFn } = useDeleteFile();
  const { data: siteMapData, isLoading: isSiteMapLoading, refetch } = useFetchSiteMapByBotId(botId);
  const { isLoading: isUpdateLoading, mutate: updateSiteMapFn } = useUpdateSitemap();
  const [fetchSitemap, setIsFetchSitemap] = useState<boolean>(false);
  const { status: updateStatus, mutate: updateChatbotFn } = useUpdateChatBot();

  useEffect(() => {
    if (siteMapData) {
      setPostData([...siteMapData]);
    }
  }, [siteMapData]);

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

  const toggleDialog = () => {
    setSelected('');
    setIsOpen(!isOpen);
  };

  const toggleAddDialog = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  const toggleAddFileDialog = () => {
    setIsAddFileModalOpen(!isAddFileModalOpen);
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
            refetch();
            setPostData([]);
            queryClient.invalidateQueries(['fetch', 'sitemap', 'bot', botId]);
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
  };

  const handleDeleteRow = (id: string) => {
    if (id) {
      deleteFn(id, {
        onSuccess: () => {
          toast({
            variant: 'success',
            title: 'Sitemap deleted successfully.',
          });
          updateChatbotFn(botId, {
            onSuccess: () => {
              toast({
                variant: 'success',
                title: 'Sitemap updated successfully.',
              });
            },
          });
          refetch();
          setSelected('');
          toggleDialog();
        },
      });
    }
  };

  const getFiles = () => {
    if (chatBotDetail) {
      return chatBotDetail.file;
    } else {
      return [];
    }
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

  const getVariants = () => {
    switch (chatBotDetail?.traning_status) {
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

  return (
    <div>
      <PageHeader
        title="Agent Training"
        isLoading={isSiteMapLoading}
        isChildPage
        onBackPress={() => navigate(routes.dashboard)}
      >
        {chatBotDetail?.traning_status && (
          <Badge variant={getVariants()}>{chatBotDetail?.traning_status}</Badge>
        )}
      </PageHeader>
      <div>
        {(isLoading || isSiteMapLoading) && (
          <>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
          </>
        )}
        {!isSiteMapLoading && (
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Training Links</h2>
                <div className="flex gap-6">
                  {siteMapData &&
                    !!siteMapData.length &&
                    hasTrainingLinkChanged(siteMapData, postData) && (
                      <Button
                        variant="outline"
                        isLoading={isUpdateLoading || updateStatus === 'loading'}
                        onClick={() => checkAccount(() => handleUpdateSiteMap())}
                        className="border-2 border-purple-500"
                        disabled={isUpdateLoading || updateStatus === 'loading'}
                      >
                        {(!isUpdateLoading || updateStatus !== 'loading') && (
                          <Check className="[&>path]:stroke-black" />
                        )}
                        Confirm Changes
                      </Button>
                    )}
                  <Button variant="purple" onClick={() => checkAccount(() => toggleAddDialog())}>
                    <AddIcon />
                    Add Link
                  </Button>

                  {chatBotDetail?.bot_id !== 'none' && chatBotDetail?.bot_id && (
                    <Button
                      variant={'purple'}
                      className="w-fit"
                      onClick={() =>
                        window.open(
                          `https://${chatBotDetail?.bot_id}.${CONFIG.BOT_DOMAIN}/home`,
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
                            .replace(':id', botId)
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
                    siteMapData.map((data: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex items-center gap-10 not:last:border-b">
                          <div className="flex-1">
                            <div className="flex gap-2 mb-1 items-center">
                              <Checkbox
                                checked
                                className="bg-purple-100 border-purple-600 [&>span>svg]:stroke-purple-600"
                              />
                              <p>{data.url}</p>
                            </div>
                            <div className="flex flex-col gap-1 ml-3">
                              {data.all_links &&
                                data.all_links.length &&
                                data.all_links.map((link: string, idx: number) => (
                                  <div className="flex gap-2 items-center" key={idx}>
                                    <Checkbox
                                      defaultChecked={data.traning_links.includes(link)}
                                      onCheckedChange={() => {
                                        handleSiteMapClick(data.id, link);
                                      }}
                                      className={cn(
                                        'bg-purple-100 border-purple-600 [&>span>svg]:stroke-purple-600',
                                        {
                                          'bg-yellow-100 border-yellow-600 [&>span>svg]:stroke-yellow-600':
                                            !data.traning_links.includes(link),
                                        },
                                      )}
                                    />
                                    <p>{link}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <p>{convertDateStringToFormattedDate(data.updated_at)}</p>
                          <CTooltip text="Edit Sitemap">
                            <Button
                              className="px-4 py-1"
                              variant="ghost"
                              onClick={(e) =>
                                checkAccount(() => {
                                  e.stopPropagation();
                                  setSelected(data.id);
                                  setSiteMapURL(data.url);
                                  setSiteMapLinks(data.all_links);
                                  setTrainingLinks(data.traning_links);
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
                                siteMapData && siteMapData.length <= 1 && getFiles().length <= 0
                              }
                              onClick={(e) =>
                                checkAccount(() => {
                                  e.stopPropagation();
                                  setSelected(data.id);
                                  setIsOpen(true);
                                })
                              }
                            >
                              <DeleteIcon className="cursor-pointer" />
                            </Button>
                          </CTooltip>
                        </div>
                        {siteMapData && !!siteMapData.length && idx + 1 !== siteMapData.length && (
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
            <div className="flex flex-col gap-2 sticky top-[100px] isolate">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Training Files</h2>
                <Button
                  variant="purple"
                  onClick={() =>
                    checkAccount(() => {
                      toggleAddFileDialog();
                    })
                  }
                >
                  <AddIcon />
                  Add
                </Button>
              </div>
              {!!getFiles().length &&
                getFiles().map((file: any, idx: number) => (
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
                    <a href={file.file} target="_blank" download>
                      <Button variant={'ghost'}>
                        <DownloadIcon className="[&>path]:stroke-gray-500 cursor-pointer" />
                      </Button>
                    </a>
                    <Button
                      variant={'ghost'}
                      isLoading={selectedFile === file.id && isDeletingFile}
                      disabled={isDeletingFile || (siteMapData && siteMapData.length <= 0)}
                      onClick={(e) =>
                        checkAccount(async () => {
                          e.stopPropagation();
                          setSelectedFile(file.id);
                          await deleteFileFn(
                            { id: file.id },
                            {
                              onSuccess: () => {
                                setSelectedFile('');
                                updateChatbotFn(botId, {
                                  onError: () => {
                                    toast({
                                      variant: 'success',
                                      title:
                                        'Error occured while updating bot with new training assets.',
                                    });
                                  },
                                });
                                refetchChatBotDetail();
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
              {getFiles() && !getFiles().length && (
                <div className="flex items-center justify-center my-5">No files found</div>
              )}
            </div>
          </div>
        )}
      </div>

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
        botId={botId}
        chatbotDetail={chatBotDetail}
        files={getFiles()}
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
      {/* Render the dialog conditionally */}
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
    </div>
  );
};

export default BotTraining;
