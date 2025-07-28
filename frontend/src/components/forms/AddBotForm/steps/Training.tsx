import { DownloadIcon, Trash } from 'lucide-react';

import { CloseIcon, FileIcon, SyncIcon } from '@/assets/icons';
import FetchSitemapDialog from '@/components/dialog/FetchSitemapDialog';
import { CTooltip, SingleImageUpload } from '@/components/molecules';
import Required from '@/components/molecules/Required';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useScrapeSitemap, useUploadFile } from '@/hooks/api';
import { useDeleteFile } from '@/hooks/api/useDeleteFile';
import { cn, convertBytes, ensureHTTPS } from '@/lib/utils';

interface ITraining {
  form: any;
  botDetail: any;
  mode?: string | null;
  tag: string[];
  setTag?: any;
  tagValue?: any;
  setTagValue?: any;
  siteMapURL: string;
  setSiteMapURL?: any;
  siteMapLinks?: string[];
  setSiteMapLinks?: any;
  fetchSitemap: boolean;
  setIsFetchSitemap?: any;
  trainFile: any[];
  setTrainFile?: any;
  trainingLinks: string[];
  setTrainingLinks: any;
  siteMapAddStatus: 'error' | 'idle' | 'loading' | 'success';
}

export const Training = ({
  form,
  mode,
  siteMapAddStatus,
  tag,
  setTag,
  tagValue,
  setTagValue,
  setSiteMapLinks,
  siteMapURL,
  setSiteMapURL,
  setIsFetchSitemap,
  fetchSitemap,
  trainFile,
  setTrainFile,
  siteMapLinks,
  setTrainingLinks,
  trainingLinks,
}: ITraining) => {
  const { toast } = useToast();

  const { isLoading: isDeletingFile, mutateAsync: deleteFileFn } = useDeleteFile();
  const { status: uploadStatus, mutateAsync: uploadFileAsynFn } = useUploadFile();
  const { isLoading: isScrapeLoading, mutateAsync: scrapeSiteMapFn } = useScrapeSitemap();

  const handleChangeTag = (e: { target: { value: any } }) => {
    setTagValue(e.target.value);
  };
  const addTags = () => {
    const tagCount = (form.watch('greeting_tags') ?? []).length;
    if (tagCount >= 3) {
      toast({
        variant: 'destructive',
        title: 'You may only set upto 3 greeting buttons, please remove one to add a new button',
      });
      return;
    }
    setTag([...tag, tagValue]);
    form.setValue('greeting_tags', [...tag, tagValue]);
    setTagValue('');
  };

  const handleScrapeSiteMaps = () => {
    // setTrainingLinks([]);
    setSiteMapLinks([]);
    if (siteMapURL) {
      scrapeSiteMapFn(ensureHTTPS(siteMapURL), {
        onSuccess: (data: any) => {
          setSiteMapLinks(data?.data?.links || []);
          setTrainingLinks(data?.data?.links || []);
          toggleSiteMapDialog();
        },
      });
    }
  };

  const handleRemoveTag = (idx: number) => {
    const newTag = [...tag];
    newTag.splice(idx, 1);
    setTag(newTag);
    form.setValue('greeting_tags', newTag);
  };

  const toggleSiteMapDialog = () => {
    setIsFetchSitemap(!fetchSitemap);
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Greeting Message */}
      <FormField
        control={form.control}
        name="greeting_message"
        render={({ field }) => (
          <FormItem className="grid grid-cols-[170px_1fr]">
            <FormLabel className="min-w-170">
              Greeting Message
              <Required />
            </FormLabel>
            <FormControl>
              <div className="m-0 md:max-w-sm w-full">
                <Textarea
                  defaultValue=""
                  placeholder="Enter a greeting message..."
                  className="m-0  h-32"
                  {...field}
                />
                <FormMessage />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Greeting Questions */}
      <>
        <div className="grid grid-cols-[170px_1fr] gap-3">
          <FormLabel className="min-w-170">
            FAQs from your visitors
            <Required />
          </FormLabel>
          <div className="flex gap-3 md:max-w-sm w-full">
            <div className="flex flex-col gap-1 w-full">
              <Input value={tagValue} disabled={tag.length >= 3} onChange={handleChangeTag} />
              <div className="text-sm font-medium text-gray-500 flex gap-2 items-center">
                <p>Max 3 Questions</p>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={!tagValue || tag.length >= 3}
              onClick={addTags}
            >
              <p className="text-gray-500 text-2xl">+</p>
            </Button>
          </div>
        </div>
        {tag && !!tag.length && (
          <div className="flex justify-between ">
            <div></div>
            <div className="md:max-w-sm flex flex-col  h-max gap-2 flex-wrap w-full">
              <div className="flex gap-2.5 flex-wrap">
                {tag?.map(
                  (value, idx) =>
                    value !== '' && (
                      <Badge
                        className="py-2 px-3  flex items-center gap-2 w-max"
                        variant="count"
                        key={idx}
                      >
                        <p className="max-w-[150px] md:max-w-xs truncate ">{value}</p>
                        <CloseIcon
                          onClick={() => handleRemoveTag(idx)}
                          className="cursor-pointer text-purple-500"
                        />
                      </Badge>
                    ),
                )}
              </div>
            </div>
          </div>
        )}
      </>

      {/* Website link/Sitemap URL */}
      {mode !== 'edit' && (
        <>
          <FormItem className="grid grid-cols-[170px_1fr]">
            <FormLabel className="min-w-170">
              Easy Onboarding Training URL
              <Required />
            </FormLabel>

            <div className="m-0 md:max-w-sm w-full">
              <FormControl>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Enter your link for AI Easy Onboarding"
                    className="m-0 md:max-w-sm"
                    value={siteMapURL}
                    disabled={siteMapAddStatus === 'loading'}
                    onChange={(e) => {
                      setSiteMapURL(e.target.value);
                    }}
                  />
                  <div className="flex gap-2">
                    <CTooltip text="Fetch sitemaps">
                      <Button
                        variant="purple"
                        type="button"
                        className="w-max"
                        onClick={handleScrapeSiteMaps}
                        isLoading={isScrapeLoading}
                        disabled={!siteMapURL || isScrapeLoading || siteMapAddStatus === 'loading'}
                      >
                        <SyncIcon className={cn({ hidden: isScrapeLoading })} />
                        {isScrapeLoading ? 'Fetching' : 'Start Training'}
                      </Button>
                    </CTooltip>
                    {siteMapLinks && !!siteMapLinks.length && (
                      <CTooltip text="View sitemaps">
                        <Button
                          variant="purple"
                          type="button"
                          className="w-max"
                          onClick={toggleSiteMapDialog}
                          isLoading={isScrapeLoading}
                          disabled={!siteMapURL || isScrapeLoading}
                        >
                          View Links
                        </Button>
                      </CTooltip>
                    )}
                  </div>
                  {form.formState.errors.files?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.files?.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </div>
          </FormItem>
        </>
      )}

      {/* Files to train bot */}
      {mode !== 'edit' && (
        <div className="grid grid-cols-[170px_1fr] gap-3">
          <FormLabel className="min-w-170">
            Training Files
            <Required />
          </FormLabel>
          <div className="flex flex-col gap-4 m-0 p-0 md:max-w-sm">
            <p className="text-gray-500 text-base font-normal">
              Browse and select the files you want to use as the knowledge base and writing style
              for your assistant.
            </p>
            <div className="flex flex-col gap-2  flex-wrap">
              <SingleImageUpload
                isLoading={uploadStatus === 'loading' ? true : false}
                title={'Upload Files'}
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
                  form.clearErrors('files');
                }}
                className="h-[46px] border border-neutral-300"
              >
                {/* <Icon source={UploadImageIcon} isSvg size={20} className="text-gray-500" /> */}
              </SingleImageUpload>
              {trainFile && !!trainFile.length && (
                <>
                  <p className="text-sm font-semibold">Added Files</p>
                  {trainFile.map((file: any, idx: number) => (
                    <Card className="p-4 flex items-center w-full gap-2" key={idx}>
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
              {form.formState.errors.files?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.files?.message}
                </p>
              )}
            </div>
            <FormMessage />
          </div>
        </div>
      )}
      <FetchSitemapDialog
        siteMapUrl={siteMapURL}
        trainingLinks={trainingLinks}
        setTrainingLinks={setTrainingLinks}
        siteMapLinks={siteMapLinks}
        isOpen={fetchSitemap}
        onClose={toggleSiteMapDialog}
      />
    </div>
  );
};
