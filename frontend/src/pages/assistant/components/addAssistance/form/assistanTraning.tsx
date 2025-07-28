import { RefreshCcw } from 'lucide-react';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { ArrowBlockLeft } from '@/assets/icons';
import { SingleImageUpload } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ASSISTANCE_ROLE } from '@/pages/assistant/constant/addAssistance';
import { useScrapSiteMapData, useUploadTraningFile } from '@/pages/assistant/hooks/addAssistance';
import { AssistanceTraningFormSchemaType } from '@/pages/assistant/routes/addAssistance';
import { IUploadFile } from '@/pages/assistant/types/addAssistance';
import { getTraningFileType } from '@/pages/assistant/utils/addAssistance';

import { ShowSiteMapDialog } from './helper/showSitemapDialog.tsx';
import { TraningFileCard } from './helper/traningFileCard';

interface IAssistanTraningProps {
  form: UseFormReturn<AssistanceTraningFormSchemaType>;
  handleNextTraningDetails: (tab: '1' | '2' | null, isChangeStep: boolean, isBack: boolean) => void;
}
export const AssistanTraning = ({ handleNextTraningDetails, form }: IAssistanTraningProps) => {
  const [openSitemapModal, setOpenSitemapModal] = React.useState<boolean>(false);
  const scrapSitemap = useScrapSiteMapData();
  const traningFileUpload = useUploadTraningFile((file: IUploadFile) => {
    const values = form.getValues('training_files') ?? [];
    form.setValue('training_files', [...values, file]);
  });

  const handleFetchSiteMap = async (url: string) => {
    form.clearErrors();
    const data = await scrapSitemap.mutateAsync({
      url: url,
    });

    if (data) {
      form.setValue('sitemap_urls', data.links);
      form.setValue('traning_links', data.links);
      setOpenSitemapModal(true);
    }
  };
  return (
    <div>
      <Form {...form}>
        <div className="grid gap-4 py-2 col-span-2">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="sitemap_url"
            render={({ field, formState }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Training URL</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-3">
                  <Input
                    id="name"
                    placeholder="Enter your company name"
                    className="col-span-4"
                    {...field}
                  />
                  <FormMessage className="w-full" />
                  <div className="flex flex-row gap-4">
                    <Button
                      disabled={formState.errors.sitemap_url !== undefined || !field.value}
                      isLoading={scrapSitemap.isLoading}
                      onClick={() => field.value && handleFetchSiteMap(field.value)}
                      className="w-fit"
                      variant={'purple'}
                      icon={<RefreshCcw size={16} />}
                    >
                      {scrapSitemap.isLoading ? 'Fetching' : 'Fetch'}
                    </Button>

                    {form.watch('traning_links')?.length > 0 && (
                      <Button
                        onClick={() => {
                          setOpenSitemapModal(true);
                        }}
                        className="w-fit"
                        variant={'purple'}
                      >
                        View Training URL
                      </Button>
                    )}
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="files"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Training Files</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <p className="text-gray-1000 font-normal text-base">
                    Browse and chose the files you want to upload from your computer to train your
                    assistant about your project.
                  </p>
                  <div className="grid grid-cols-2 gap-3 col-span-4">
                    <SingleImageUpload
                      title="Choose File"
                      accept={{
                        'application/pdf': [],
                        'application/vnd.ms-excel': [],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                          [],
                        'application/docx': [],
                        'text/plain': [],
                        'application/msword': [],
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                      }}
                      multiple
                      isLoading={traningFileUpload.isLoading}
                      onImageUpload={async (files) => {
                        form.clearErrors();
                        const uploadPromises = files.map((file: File) => {
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('name', file.name);
                          formData.append('type', getTraningFileType(file.type));
                          formData.append('size', file.size.toString());
                          return traningFileUpload.mutateAsync(formData);
                        });
                        await Promise.all(uploadPromises);
                      }}
                      className="h-[50px] bg-white border border-neutral-300"
                    ></SingleImageUpload>
                  </div>
                  <FormMessage className="w-full" />
                  <div className="grid grid-cols-1 gap-2">
                    {form.watch('training_files')?.map((file: IUploadFile) => (
                      <TraningFileCard
                        onSuccess={() => {
                          form.setValue(
                            'training_files',
                            form.watch('training_files').filter((f) => f.id !== file.id),
                          );
                        }}
                        file={file}
                        key={file.id}
                      />
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agent_role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Assistant Role</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <p className="text-gray-1000 font-normal text-base">
                    Select a role for your assistant.
                  </p>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="m-0 col-span-4 ">
                      <div className="flex items-center gap-3 select-value-role">
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {ASSISTANCE_ROLE.map((item, idx) => (
                        <SelectItem value={item.value} key={idx}>
                          <div className="flex flex-col max-w-[400px] w-full">
                            <h1 className="text-base font-medium text-gray-700 assitance-role-label ">
                              {item.label}
                            </h1>
                            <p className="text-sm font-normal text-gray-1000 assitance-role-description">
                              {item.description}
                            </p>
                            <p className="text-sm font-normal text-gray-1000 assistance-role-tone">
                              <span className="font-semibold">Tone: </span>
                              {item.tone}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="w-full" />
                </div>
              </FormItem>
            )}
          />
          <FormItem>
            <div></div>
            <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
              <div className="flex items-center gap-3 ">
                <Button
                  type="submit"
                  variant="outline"
                  onClick={() => handleNextTraningDetails('1', false, true)}
                  icon={<ArrowBlockLeft />}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="purple"
                  icon={<ArrowBlockLeft className="-rotate-180" />}
                  onClick={() => handleNextTraningDetails('1', true, false)}
                >
                  Next
                </Button>
              </div>
            </div>
          </FormItem>
        </div>
      </Form>
      {openSitemapModal && (
        <ShowSiteMapDialog
          isOpen={openSitemapModal}
          onClose={() => {
            setOpenSitemapModal(false);
          }}
          isViewMode
          sitemap_url={form.watch('sitemap_url') ?? ''}
          sitemap_urls={form.watch('sitemap_urls') ?? []}
          handleCheckAll={(val) => {
            if (val) {
              form.setValue(
                'traning_links',
                form.watch('sitemap_urls').map((url) => url),
              );
            } else {
              form.setValue('traning_links', []);
            }
          }}
          traning_links={form.watch('traning_links') ?? []}
          isCheckedAll={form.watch('traning_links')?.length === form.watch('sitemap_urls')?.length}
          hanldeCheckSiteMap={(url, check) => {
            if (check) {
              form.setValue('traning_links', [...form.watch('traning_links'), url]);
            } else {
              form.setValue(
                'traning_links',
                form.watch('traning_links').filter((link) => link !== url),
              );
            }
          }}
        />
      )}
    </div>
  );
};
