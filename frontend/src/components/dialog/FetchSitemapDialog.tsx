import { useEffect, useState } from 'react';

import { PlayIcon, SearchNotFound, SyncIcon } from '@/assets/icons';
import { useToast } from '@/components/ui/use-toast';
import { useDeployChatbot, useScrapeSitemap, useUpdateSitemap } from '@/hooks/api';
import { cn, ensureHTTPS } from '@/lib/utils';

import { CTooltip, SearchInput } from '../molecules';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { CustomDialog } from '.';

interface IFetchSitemapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  siteMapUrl: string;
  siteMapLinks?: string[];
  setSiteMapLinks?: any;
  trainingLinks: string[];
  setTrainingLinks: React.Dispatch<React.SetStateAction<string[]>>;
  mode?: 'add' | 'edit';
  chatbotId?: string;
  siteMapId?: string;
  refetch?: any;
}

const FetchSitemapDialog = ({
  isOpen,
  onClose,
  siteMapUrl,
  siteMapLinks,
  setSiteMapLinks,
  trainingLinks,
  setTrainingLinks,
  mode = 'add',
  siteMapId,
  chatbotId,
  refetch,
}: IFetchSitemapDialogProps) => {
  const { toast } = useToast();

  const [url, setUrl] = useState<string>('');
  const { isLoading: isUpdateLoading, mutate: updateSiteMapFn } = useUpdateSitemap();
  const { isLoading: isScrapeLoading, mutate: scrapeSiteMapFn } = useScrapeSitemap();
  const { status: deploymentStatus, mutate: deployChatbotFn } = useDeployChatbot();

  useEffect(() => {
    setUrl(siteMapUrl);
  }, [isOpen]);

  const handleSiteMapClick = (link: string) => {
    if (trainingLinks.includes(link)) {
      setTrainingLinks(trainingLinks.filter((existingItem) => existingItem !== link));
    } else {
      setTrainingLinks([...trainingLinks, link]);
    }
  };

  const handleUpdateSiteMap = () => {
    updateSiteMapFn(
      {
        id: siteMapId,
        url: ensureHTTPS(url),
        traning_links: trainingLinks,
        chatbot: chatbotId,
      },
      {
        onSuccess: () => {
          deployChatbotFn(chatbotId as string, {
            onSuccess: () => {
              toast({
                variant: 'success',
                title: 'Sitemap updated successfully.',
              });
            },
          });
          refetch?.();
          onClose();
        },
      },
    );
  };

  const handleScrapeSiteMaps = () => {
    setTrainingLinks([]);
    setSiteMapLinks([]);
    if (siteMapUrl) {
      scrapeSiteMapFn(ensureHTTPS(url), {
        onSuccess: (data: any) => {
          setSiteMapLinks(data?.data?.links || []);
        },
      });
    }
  };

  return (
    <>
      <CustomDialog
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-5xl overflow-auto"
        body={
          <div className="flex max-h-[90vh] flex-col">
            <h3 className="text-2xl font-semibold mb-5">
              {mode === 'add' ? 'Fetch Links' : 'Update Links'}
            </h3>
            <Separator />
            <div className="flex mt-10 mb-5 gap-4 font-medium ">
              <h5 className="w-max text-gray-700 text-sm">Website URL</h5>
              <Input
                disabled={mode === 'add'}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                className="flex-1"
                value={url}
              />
              {siteMapUrl !== url && url !== '' && (
                <CTooltip text="Fetch sitemaps">
                  <Button
                    variant="purple"
                    type="button"
                    className="w-max"
                    onClick={handleScrapeSiteMaps}
                    isLoading={isScrapeLoading}
                    disabled={!siteMapUrl || isScrapeLoading}
                  >
                    <SyncIcon className={cn({ hidden: isScrapeLoading })} />
                    {isScrapeLoading ? 'Fetching' : 'Fetch'}
                  </Button>
                </CTooltip>
              )}
            </div>
            <Separator />
            <div className="flex justify-between my-5 gap-4 font-medium">
              <h5 className="w-max  text-lg font-semibold">
                {siteMapLinks && siteMapLinks.length} Links Found
              </h5>
              <SearchInput onSearch={() => {}} disabled={!siteMapLinks || !siteMapLinks.length} />
            </div>
            <Card className="overflow-hidden max-h-[500px] overflow-scroll">
              <div className="flex items-center gap-2 p-3.5 bg-gray-200">
                <Checkbox
                  className="bg-white"
                  disabled={!siteMapLinks || !siteMapLinks.length}
                  id="selectAll"
                  checked={trainingLinks.length === siteMapLinks?.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTrainingLinks(siteMapLinks!);
                    }
                    if (!checked) {
                      setTrainingLinks([]);
                    }
                  }}
                />
                <p className="text-gray-700 text-sm">URL</p>
              </div>
              <div className="p-3.5">
                {siteMapLinks &&
                  !!siteMapLinks.length &&
                  siteMapLinks.map((link, idx) => (
                    <div className="flex items-center gap-2" key={idx}>
                      <Checkbox
                        onCheckedChange={() => handleSiteMapClick(link)}
                        value={link}
                        checked={trainingLinks.includes(link)}
                      />
                      <p className="text-gray-700 text-sm">{link}</p>
                    </div>
                  ))}
                {siteMapLinks && !siteMapLinks.length && (
                  <div className="flex flex-col items-center">
                    <div className="flex mb-6 justify-center">
                      <SearchNotFound className="w-16 h-16" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-700">No links found!</h4>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Button
              variant="purple"
              isLoading={isUpdateLoading || deploymentStatus === 'loading'}
              onClick={() => {
                if (mode === 'add') {
                  onClose();
                }
                if (mode === 'edit') {
                  handleUpdateSiteMap();
                }
              }}
              className="w-max self-end mt-10"
            >
              {mode !== 'edit' && <PlayIcon />}
              {mode === 'edit' ? 'Update' : 'Add links'}
            </Button>
          </div>
        }
      />
    </>
  );
};

export default FetchSitemapDialog;
