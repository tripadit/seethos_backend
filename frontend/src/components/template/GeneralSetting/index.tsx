import { zodResolver } from '@hookform/resolvers/zod';
import { FlagIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ClockIcon, SaveIcon } from '@/assets/icons';
import { DualityLogo } from '@/assets/images';
import { FormLoader } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRYLIST, TIME_ZONES } from '@/global/appConstants';
import { generalSettingSchema, useGeneralSetting, useGetCurrentUserInfo } from '@/hooks/api';
import { convertDateStringToFormattedDate } from '@/lib/utils';

export const GeneralSetting = () => {
  const { mutate: updateProfileFn, isLoading } = useGeneralSetting();
  const form = useForm<z.infer<typeof generalSettingSchema>>({
    resolver: zodResolver(generalSettingSchema),
  });
  const { data, isLoading: isFetching } = useGetCurrentUserInfo({
    onSuccess: (data: any) => {
      form.reset({
        ...data.data,
        date_joined: convertDateStringToFormattedDate(data.data.date_joined),
      });
    },
  });

  function onSubmit(values: z.infer<typeof generalSettingSchema>) {
    updateProfileFn(values);
  }

  return (
    <Card className="w-[656px] p-10 gap-10 flex flex-col">
      <CardTitle className="text-gray-700">General Setting</CardTitle>
      {isFetching && <FormLoader />}
      {!isFetching && (
        <CardContent className="flex flex-col gap-5  -ml-5">
          <div className="grid grid-cols-4 gap-5">
            <p className="col-span-1 text-sm text-gray-700 font-medium">Avatar</p>
            <div className="m-0 md:max-w-sm w-full flex flex-row gap-3 items-center">
              <img src={DualityLogo} className="w-12 h-12 rounded-full object-cover" />
              <Button variant={'outline'}>Change</Button>
              <Button variant={'outline'}>Remove</Button>
            </div>
          </div>
          <Form {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-sm ">Full Name</FormLabel>
                    <div className="m-0 md:max-w-sm w-full">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-sm ">Email</FormLabel>
                    <div className="m-0 md:max-w-sm w-full">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-sm ">Phone Number</FormLabel>
                    <div className="m-0 md:max-w-sm w-full">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="date_joined"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-sm ">Date Created</FormLabel>
                    <div className="m-0 md:max-w-sm w-full">
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-3 justify-between">
                <p className="col-span-1 text-sm text-gray-700 font-medium">Location</p>
                <div className="m-0 md:max-w-sm w-full flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="m-0 md:max-w-sm w-full">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <div className="flex items-center gap-3">
                                  <FlagIcon size={18} />
                                  <SelectValue placeholder="Select country" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRYLIST.map((country) => (
                                  <SelectItem value={country.name} key={country.code}>
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="City" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="State" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <FormControl>
                      <div className="m-0 md:max-w-sm w-full">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <div className="flex items-center gap-3">
                              <ClockIcon />
                              <SelectValue placeholder="Select timezone" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_ZONES.map((time_zone, idx) => (
                              <SelectItem
                                value={`${time_zone.name} ${time_zone.value}`}
                                key={idx}
                              >{`${time_zone.name} ${time_zone.value}`}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-center items-center gap-5 pr-5 pt-5">
                <Button
                  variant={'outline'}
                  disabled={!form.formState.isDirty}
                  onClick={() => {
                    const userInfo: any = data?.data;
                    form.reset(userInfo);
                  }}
                >
                  <X />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant={'purple'}
                  disabled={!form.formState.isDirty}
                >
                  <SaveIcon />
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      )}
    </Card>
  );
};
