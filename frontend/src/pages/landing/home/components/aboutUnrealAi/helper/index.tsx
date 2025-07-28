import clsx from 'clsx';
import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import { ABOUTUNREALAI } from '../../../constant/home';

export const UnrealAiCarousel = () => {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-[1008px]"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-fit">
        {ABOUTUNREALAI.map((item, index) => (
          <CarouselItem key={index + 'about-unreal-ai'} className="h-[300px] sm:h-[545px]">
            <div className="h-full w-full  border border-white/20 rounded-xl bg-transparent p-10 gap-10 shadow-professionalAssistance flex flex-col items-center justify-center ">
              {item.title && (
                <h1
                  className={clsx(
                    'text-white text-base sm:text-32 font-extrabold sm:leading-[38.2px] text-center',
                    item.titleClassName,
                  )}
                >
                  {item.title}
                  <br />
                  {item.subTitle}
                </h1>
              )}
              <img
                src={item.image}
                className={clsx({
                  'mobile:object-contain mobile:w-[150px] mobile:h-[150px]':
                    item.title && index <= 1,
                  'mobile:object-contain mobile:w-full mobile:h-[300px]': item.title && index > 1,
                })}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <div className="absolute bottom-0 h-14 w-full">
        <div className="flex flex-row gap-5 justify-center items-center ">
          <div className="relative flex w-[252px] items-center justify-center">
            <CarouselPrevious className="carousel-button bg-transparent border border-purple-500 hover:border-purple-500 hover:bg-purple-500 hover:text-white text-purple-500 text-4xl w-12 h-12 " />
            <Button size={'lg'} variant={'unrealPrimaryBtn'} className="w-fit">
              Download Slide-deck
            </Button>
            <CarouselNext className="carousel-button bg-transparent border border-purple-500 hover:border-purple-500 hover:bg-purple-500 text-purple-500 hover:text-white   w-12 h-12 " />
          </div>
        </div>
      </div> */}
    </Carousel>
  );
};
