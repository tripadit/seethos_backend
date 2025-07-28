import clsx from 'clsx';
import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import { POWERPAGEORGANIZATION } from '../../../constant/home';

export const PowerOragnization = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-[1008px]"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      setApi={setApi}
    >
      <CarouselContent className="h-fit">
        {POWERPAGEORGANIZATION.map((item, index) => (
          <CarouselItem key={index + 'power-organization-ai'} className="h-[300px] sm:h-[545px]">
            <div className="h-full w-full  border border-white/20 rounded-xl bg-transparent p-10 gap-10 shadow-professionalAssistance flex flex-col items-center justify-between ">
              {item.title && (
                <h1 className="text-white text-base max-w-[670px] w-full sm:text-32 font-extrabold sm:leading-[38.2px] text-center">
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
              <div className="flex flex-row gap-2">
                {Array.from({ length: count }).map((_, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setCurrent(i);
                        api?.scrollTo(i);
                      }}
                      className={clsx('w-[10px] h-[10px] rounded-full cursor-pointer ', {
                        'bg-white': current === i + 1,
                        'bg-white/40': current !== i + 1,
                      })}
                    ></div>
                  );
                })}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
