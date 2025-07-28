import { DownloadIcon, Trash, Upload, X } from 'lucide-react';
import { useState } from 'react';

import { FileIcon } from '@/assets/icons';
import { useUpdateBot, useUpdateChatBot, useUploadFile } from '@/hooks/api';
import { useDeleteFile } from '@/hooks/api/useDeleteFile';
import { convertBytes } from '@/lib/utils';
import queryClient from '@/utils/queryClient';

import { SingleImageUpload } from '../molecules';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { DialogFooter } from '../ui/dialog';
import { useToast } from '../ui/use-toast';
import { CustomDialog } from '.';

interface IFileDialogProps {
  botId: string;
  isOpen: boolean;
  onClose: () => void;
  chatbotDetail: any;
  files: any;
  refetch?: any;
}

export const AddFileDialog = ({
  refetch,
  chatbotDetail,
  files,
  isOpen,
  onClose,
}: IFileDialogProps) => {
  const { toast } = useToast();
  const [trainFile, setTrainFile] = useState<any[]>([]);
  const { isLoading: isDeletingFile, mutateAsync: deleteFileFn } = useDeleteFile();
  const { status: uploadStatus, mutateAsync: uploadFileAsynFn } = useUploadFile();
  const { status: botUpdateStatus, mutate: updateBotFn } = useUpdateBot();
  const { status: chatUpdateStatus, mutate: updateChatbotFn } = useUpdateChatBot();

  const handleUpdateFiles = () => {
    const req = {
      ...chatbotDetail,
      files: [
        ...(files ? files.map((el: any) => parseInt(el.id)) : []),
        ...(trainFile ? trainFile.map((el: any) => parseInt(el.id)) : []),
      ],
    };
    delete req.sitemap_url;
    delete req.traning_links;
    delete req.file;
    if (typeof req.company_logo === 'string') {
      delete req.company_logo;
    }
    if (typeof req.avatar === 'string') {
      delete req.avatar;
    }

    updateBotFn(req, {
      onSuccess: () => {
        toast({
          variant: 'success',
          title: 'Updating agent...',
        });
        refetch?.();
        updateChatbotFn(req.id as string, {
          onSuccess: () => {
            onClose();
            toast({
              variant: 'success',
              title: 'Agent updated successfully',
            });
          },
        });
      },
    });
  };

  return (
    <>
      <CustomDialog
        title="Add Training Files"
        isOpen={isOpen}
        onClose={() => {
          setTrainFile([]);
          onClose();
        }}
        className=" overflow-auto"
        body={
          <>
            <div className="flex flex-col">
              <div className="flex gap-2 items-center flex-wrap">
                <SingleImageUpload
                  isLoading={uploadStatus === 'loading' ? true : false}
                  title={'Choose File'}
                  multiple
                  accept={{
                    'application/pdf': [],
                    'application/vnd.ms-excel': [],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                    'application/docx': [],
                    'text/plain': [],
                    'application/msword': [],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                  }}
                  onImageUpload={async (file: File[]) => {
                    let res: any[] = [...trainFile];
                    for (let i = 0; i < file.length; i++) {
                      const item = file[i];

                      await uploadFileAsynFn(item, {
                        onSuccess: (response: any) => {
                          res.push({ ...response });
                          toast({
                            variant: 'success',
                            title: 'File uploaded succesfully!',
                          });
                        },
                      });
                    }
                    setTrainFile(res);
                  }}
                  className="h-[80px] w-full border border-neutral-300"
                ></SingleImageUpload>
                {trainFile && !!trainFile.length && (
                  <>
                    <p className="text-sm font-semibold">Added Files</p>
                    {trainFile.map((file: any, idx: number) => (
                      <Card className="p-4 flex items-center w-full gap-2" key={idx}>
                        <Checkbox />
                        <FileIcon />
                        <div className="flex items-end justify-between flex-1">
                          <div>
                            <h4>{file.name || `File ${idx + 1}`}</h4>
                            <p>{convertBytes(file.size)}</p>
                          </div>
                        </div>
                        <a
                          href={file?.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs"
                        >
                          <Button variant={'ghost'}>
                            <DownloadIcon className="[&>path]:stroke-gray-500 cursor-pointer" />
                          </Button>
                        </a>
                        <Button
                          variant={'ghost'}
                          isLoading={isDeletingFile}
                          disabled={isDeletingFile}
                          onClick={async () => {
                            await deleteFileFn({ id: file.id });
                            const items = [...trainFile];
                            const newItems = items.filter((item) => item.id !== file.id);
                            setTrainFile(newItems);
                          }}
                        >
                          <Trash size={14} />
                        </Button>
                      </Card>
                    ))}
                  </>
                )}
              </div>
              <DialogFooter className="mt-4">
                <div className="flex items-center gap-3  justify-center  w-full">
                  <Button
                    onClick={() => {
                      queryClient.cancelQueries(['updateChatBot']);
                      queryClient.invalidateQueries(['updateChatBot']);
                      setTrainFile([]);
                      onClose();
                    }}
                    variant="outline"
                  >
                    <X /> Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateFiles}
                    isLoading={botUpdateStatus === 'loading' || chatUpdateStatus === 'loading'}
                    disabled={
                      uploadStatus === 'loading' ||
                      !trainFile.length ||
                      botUpdateStatus === 'loading' ||
                      chatUpdateStatus === 'loading'
                    }
                    variant="purple"
                  >
                    {(botUpdateStatus === 'loading' || chatUpdateStatus === 'loading') && (
                      <Upload />
                    )}
                    Upload
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </>
        }
      />
    </>
  );
};
