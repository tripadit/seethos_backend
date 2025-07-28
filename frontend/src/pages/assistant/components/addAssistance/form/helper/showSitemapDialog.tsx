import { RefreshCcw } from 'lucide-react';
import React from 'react';

import { PlayIcon, SearchNotFound } from '@/assets/icons';
import { CustomDialog } from '@/components/dialog';
import { CTooltip, SearchInput } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
interface IShowSiteMapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sitemap_url: string;
  isViewMode: boolean;
  sitemap_urls: string[];
  handleCheckAll?: (checked: boolean) => void;
  isCheckedAll?: boolean;
  traning_links?: string[];
  hanldeCheckSiteMap?: (link: string, check: boolean) => void;
}

export const ShowSiteMapDialog = ({
  isOpen,
  onClose,
  sitemap_url,
  isViewMode,
  sitemap_urls = [],
  isCheckedAll = false,
  handleCheckAll,
  traning_links = [],
  hanldeCheckSiteMap,
}: IShowSiteMapDialogProps) => {
  const [siteMapLinks, setSiteMapLinks] = React.useState<string[]>([...sitemap_urls]);

  return (
    <>
      <CustomDialog
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-5xl overflow-auto"
        body={
          <div className="flex max-h-[90vh] flex-col">
            <h3 className="text-2xl font-semibold mb-5">Fetch Links</h3>
            <Separator />
            <div className="flex mt-10 mb-5 gap-4 font-medium ">
              <h5 className="w-max text-gray-700 text-sm">Website URL</h5>
              <Input disabled={isViewMode} className="flex-1" value={sitemap_url} />
              {!isViewMode && (
                <CTooltip text="Fetch sitemaps">
                  <Button variant="purple" type="button" className="w-max" icon={<RefreshCcw />}>
                    Fetch
                  </Button>
                </CTooltip>
              )}
            </div>
            <Separator />
            <div className="flex justify-between my-5 gap-4 font-medium">
              <h5 className="w-max  text-lg font-semibold">{sitemap_urls.length} Links Found</h5>
              <SearchInput
                className="max-w-[400px] w-full"
                onSearch={(value: string) => {
                  const filteredUrls = sitemap_urls.filter((url) =>
                    url.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
                  );
                  setSiteMapLinks(filteredUrls);
                }}
                disabled={sitemap_urls.length === 0}
              />
            </div>
            <Card className="max-h-[500px] overflow-scroll">
              <div className="flex items-center gap-2 p-3.5 bg-gray-200">
                <Checkbox
                  onCheckedChange={handleCheckAll}
                  checked={isCheckedAll}
                  className="bg-white"
                  id="selectAll"
                />
                <p className="text-gray-700 text-sm">URL</p>
              </div>
              <div className="p-3.5 flex flex-col gap-2">
                {siteMapLinks.map((link, idx) => (
                  <div className="flex items-center gap-2" key={idx}>
                    <Checkbox
                      onCheckedChange={(check: boolean) => {
                        hanldeCheckSiteMap!(link, check);
                      }}
                      value={link}
                      checked={traning_links.includes(link)}
                    />
                    <p
                      onClick={() => {
                        hanldeCheckSiteMap!(link, !traning_links.includes(link));
                      }}
                      className="text-gray-700 text-sm cursor-pointer"
                    >
                      {link}
                    </p>
                  </div>
                ))}
                {siteMapLinks.length === 0 && (
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
              onClick={() => {
                if (isViewMode) {
                  onClose();
                }
              }}
              className="w-max self-end mt-10"
              icon={<PlayIcon />}
            >
              Add links
            </Button>
          </div>
        }
      />
    </>
  );
};
