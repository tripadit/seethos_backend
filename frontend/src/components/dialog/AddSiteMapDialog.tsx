import { useCallback, useState } from 'react';

import { PlayIcon, SearchNotFound, SyncIcon } from '@/assets/icons';
import { useAddSitemap, useScrapeSitemap, useUpdateChatBot } from '@/hooks/api';
import { cn, ensureHTTPS, searchForKeyword } from '@/lib/utils';
import queryClient from '@/utils/queryClient';

import { CTooltip, SearchInput } from '../molecules';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';
import { CustomDialog } from '.';

interface IAddSitemapDialogProps {
  botId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddSitemapDialog = ({ botId, isOpen, onClose }: IAddSitemapDialogProps) => {
  const { toast } = useToast();
  const [searchLinks, setSearchLinks] = useState<string[]>();
  const [siteMapURL, setSiteMapURL] = useState<string>('');
  const [siteMapLinks, setSiteMapLinks] = useState<string[]>([]);
  const [trainingLinks, setTrainingLinks] = useState<string[]>([]);
  const { status: siteMapAddStatus, mutate: addSiteMapFn } = useAddSitemap();
  const { isLoading: isScrapeLoading, mutate: scrapeSiteMapFn } = useScrapeSitemap();
  const { mutate: updateChatbotFn } = useUpdateChatBot();

  const handleSiteMapClick = (link: string) => {
    if (trainingLinks.includes(link)) {
      setTrainingLinks(trainingLinks.filter((existingItem) => existingItem !== link));
    } else {
      setTrainingLinks([...trainingLinks, link]);
    }
  };

  const handleScrapeSiteMaps = () => {
    setTrainingLinks([]);
    setSiteMapLinks([]);
    setSearchLinks([]);
    if (siteMapURL) {
      scrapeSiteMapFn(ensureHTTPS(siteMapURL), {
        onSuccess: (data: any) => {
          setSearchLinks(data?.data?.links || []);
          setTrainingLinks(data?.data?.links || []);
          setSiteMapLinks(data?.data?.links || []);
        },
      });
    }
  };

  const handleInputChange = (e: any) => {
    setSiteMapURL(e.target.value);
  };

  const resetValue = () => {
    setSiteMapURL('');
    setTrainingLinks([]);
    setSiteMapLinks([]);
  };

  const handleAddSiteMap = () => {
    addSiteMapFn(
      {
        url: ensureHTTPS(siteMapURL),
        traning_links: trainingLinks,
        chatbot: botId,
      },
      {
        onSuccess: () => {
          toast({
            variant: 'success',
            title: 'Sitemap added sucessfully',
          });
          queryClient.invalidateQueries(['fetch', 'sitemap', 'bot', botId]);
          updateChatbotFn(botId, {
            onSuccess: () => {
              toast({
                variant: 'success',
                title: 'Sitemap updated successfully.',
              });
            },
          });
          onClose();
          resetValue();
        },
      },
    );
  };

  const handleChange = useCallback((search: string) => {
    if (search === '') {
      setSearchLinks([...siteMapLinks]);
    }
    const result: string[] = searchForKeyword(siteMapLinks, search);
    setSearchLinks([...result]);
  }, []);

  return (
    <>
      <CustomDialog
        isOpen={isOpen}
        onClose={() => {
          resetValue();
          onClose();
        }}
        className="max-w-5xl overflow-auto"
        body={
          <div className="flex max-h-[90vh] flex-col">
            <h3 className="text-2xl font-semibold mb-5">Training Links</h3>
            <Separator />
            <div className="flex mt-10 mb-5 gap-4 font-medium">
              <h5 className="w-max text-gray-700 text-sm">Website URL</h5>
              <Input className="flex-1" value={siteMapURL} onChange={handleInputChange} />
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
                  {isScrapeLoading ? 'Fetching' : 'Fetch'}
                </Button>
              </CTooltip>
            </div>

            <Separator />
            <div className="flex justify-between my-5 gap-4 font-medium">
              <h5 className="w-max  text-lg font-semibold">
                {siteMapLinks && siteMapLinks.length} Links Found
              </h5>
              <SearchInput onSearch={handleChange} />
            </div>
            <Card className="overflow-hidden ">
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
              <div className="p-3.5 h-[300px] overflow-auto">
                {searchLinks &&
                  !!searchLinks.length &&
                  searchLinks.map((link, idx) => (
                    <div className="flex items-center gap-2" key={idx}>
                      <Checkbox
                        onCheckedChange={() => handleSiteMapClick(link)}
                        value={link}
                        checked={trainingLinks.includes(link)}
                      />
                      <p className="text-gray-700 text-sm">{link}</p>
                    </div>
                  ))}
                {searchLinks && !searchLinks.length && (
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
              isLoading={siteMapAddStatus === 'loading'}
              onClick={handleAddSiteMap}
              className="w-max self-end mt-10"
            >
              {siteMapAddStatus !== 'loading' && <PlayIcon />}
              Save
            </Button>
          </div>
        }
      />
    </>
  );
};

export default AddSitemapDialog;
