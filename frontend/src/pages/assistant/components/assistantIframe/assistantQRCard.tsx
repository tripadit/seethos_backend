import domtoimage from 'dom-to-image';
import { CopyIcon, DownloadIcon } from 'lucide-react';
import React from 'react';
import QRCode from 'react-qr-code';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { CONFIG } from '@/global/config.ts';

import { IAssistant } from '../../types/addAssistantSuccess';

interface IAssistantQRCardProps {
  assistant: IAssistant;
}

export const AssistantQRCard = ({ assistant }: IAssistantQRCardProps) => {
  const qrRef = React.useRef<any>(null);
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
  const downloadQR = () => {
    domtoimage.toBlob(qrRef?.current).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${assistant?.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  return (
    <Card className="border h-fit border-[#F3F3F3] shadow-qrCard">
      <CardContent className="p-5">
        <div className="flex flex-col gap-2 items-center ">
          <div className="flex flex-col gap-1 w-full max-w-[536px]">
            <h1 className="text-lg text-black font-semibold text-center">
              Don't have a website? No worries, we got your covered.
            </h1>

            <p className="text-base font-normal text-gray-500 text-center">
              You can use this QR code/Link to allow your clients interact with your assistant in
              the personalized landing page made for you.
            </p>
          </div>
          <div className="flex flex-row justify-center  gap-4">
            {/* <img src={QRImage} className="h-[97px] w-[97px] object-contain" /> */}
            <div ref={qrRef}>
              <QRCode
                value={`https://${assistant?.bot_id}.${CONFIG.BOT_DOMAIN}/home`}
                className="h-[120px] w-[120px]"
              />
            </div>
            <div className="flex flex-col gap-2 justify-end items-end">
              <Button variant={'purple'} className="w-fit h-[36px] text-sm" onClick={downloadQR}>
                <DownloadIcon size={16} />
                Download
              </Button>
              <Button
                variant={'outline'}
                className="w-fit h-[36px] text-sm"
                onClick={() =>
                  handleCopyLink(`https://${assistant?.bot_id}.${CONFIG.BOT_DOMAIN}/home`)
                }
              >
                <CopyIcon size={16} />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
