import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { MailIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMixpanel } from 'react-mixpanel-browser';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CFormItem, Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { APPMIXPANELV2 } from '@/mixpanel/appMixpanel';
import { routes } from '@/routes/routes';
export const businessEmail = z.object({
  email: z.string().email('Invalid email address.'),
});

export const HomePageForm = ({
  isHeroSection,
  buttonText = 'Try Out Unreal AI',
}: {
  isHeroSection?: boolean;
  buttonText?: string;
}) => {
  const navigate = useNavigate();
  const mixpanel = useMixpanel();
  const form = useForm<z.infer<typeof businessEmail>>({
    resolver: zodResolver(businessEmail),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = (values: z.infer<typeof businessEmail>) => {
    APPMIXPANELV2.herosection.tryOutUnrealAi(mixpanel, values.email);
    navigate(routes.signnUp + '?email=' + values.email);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div
          className={clsx('flex flex-row flex-1 w-full gap-5  justify-center mobile:flex-col', {
            ' xl:justify-start': isHeroSection,
          })}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <CFormItem>
                <FormControl>
                  <div
                    className="relative w-[320px] "
                    data-aos="fade-up"
                    data-aos-delay={'400'}
                    data-aos-offset={'0'}
                  >
                    <div className="absolute top-1/2 z-10 left-4 transform -translate-y-1/2">
                      <MailIcon className="text-white" />
                    </div>
                    <Input
                      placeholder="Enter your business email"
                      className="bg-transparent pl-11 text-white text-base h-11 shadow-heroInput border border-[#D0D5DD80] rounded-md  bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </CFormItem>
            )}
          />

          <Button
            data-aos="fade-up"
            data-aos-delay={'400'}
            data-aos-offset={'0'}
            variant={'unrealPrimaryBtn'}
            size={'lg'}
            type="submit"
            // className="mobile:w-full whitespace-nowrap"
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
