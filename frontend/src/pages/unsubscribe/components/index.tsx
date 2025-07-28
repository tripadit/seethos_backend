import { FacebookIcon, InstagramIcon, LinkedinIcon, Mail, TwitterIcon } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import { PinterestIcon, TiktokIcon } from '@/assets/icons';
import { APPLOGO } from '@/assets/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useUnsubscribe } from '../hooks/unsubscribe';

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const company = params.get('company_name');
  const email = params.get('email');
  const source = params.get('source');
  const unsubscribe = useUnsubscribe();
  const unsubscribeEmail = () => {
    unsubscribe.mutate({ email: email || '', source: source || '' });
  };
  return (
    <div className="h-screen w-screen flex justify-center relative">
      <div className="flex flex-col gap-4 items-center w-fit h-fit mt-20 rounded-lg p-10 border border-gray-400">
        <div className={`flex flex-col gap-y-4 items-center`}>
          <Link to="/" className="flex gap-4 px-4">
            <img src={APPLOGO.BrandLogo} className=" object-contain cursor-pointer duration-500" />
            <h1
              className={`text-black font-semibold whitespace-nowrap origin-left font-medium text-xl duration-200 ${
                !open && 'hidden'
              }`}
            >
              Unreal AI
            </h1>
          </Link>
        </div>

        <div>
          <Mail className="text-gray-500" size={50} />
        </div>
        <div className="text-2xl">
          You {unsubscribe?.data ? 'have been' : 'will be'} unsubscribed.{' '}
        </div>
        <div className="text-sm text-gray-500">
          You will no longer receive any emails from {company}.
        </div>
        <div>
          <Button
            variant={'purple'}
            disabled={!!unsubscribe.data}
            isLoading={unsubscribe.isLoading}
            className={cn('mt-4', unsubscribe.data ? '!bg-gray-400' : 'bg-purple-500')}
            onClick={unsubscribeEmail}
          >
            Unsubscribe{unsubscribe?.data && 'd'}
          </Button>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex p-5 flex-row mobile:flex-col mobile:gap-5 justify-between items-center">
        <p
          className="text-black text-base"
          data-aos="fade-right"
          data-aos-offset={'0'}
          data-aos-delay={'200'}
        >
          <span className=""> Copyright © {new Date().getFullYear()},</span>{' '}
          <a
            href="https://unrealai.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-purple-500"
          >
            UNREALAI, Co.
          </a>
          <span className=""> All Rights Reserved.</span>{' '}
        </p>
        <div className="flex flex-row gap-5 items-center">
          <a
            href="https://www.facebook.com/scalebuildai"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'200'}
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
              <FacebookIcon fill="text-black" size={18} strokeOpacity={0} />
            </div>
          </a>
          <a
            href="https://twitter.com/scalebuildai"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'300'}
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
              <TwitterIcon fill="text-black" size={18} strokeOpacity={0} />
            </div>
          </a>
          <a
            href="https://www.linkedin.com/company/scalebuildai"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'400'}
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
              <LinkedinIcon fill="text-black" strokeOpacity={0} size={18} />
            </div>
          </a>
          <a
            href="https://www.instagram.com/scalebuildai"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'500'}
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
              <InstagramIcon />
            </div>
          </a>
          <a
            href="https://www.pinterest.es/scalebuildai/"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'600'}
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
              <PinterestIcon />
            </div>
          </a>
          <a
            href="https://www.tiktok.com/@scalebuildai?_t=8foXTR0OSKP&_r=1"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'700'}
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
              <TiktokIcon />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
