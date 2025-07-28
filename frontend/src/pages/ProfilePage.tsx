import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ClockIcon, SaveIcon } from '@/assets/icons';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { FormLoader } from '@/components/forms';
import { PageHeader, SingleImageUpload } from '@/components/molecules';
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
import { Textarea } from '@/components/ui/textarea';
import { COMPANY_SECTORS, COMPANY_SIZES_EU, TIME_ZONES } from '@/global/appConstants';
import { generalSettingSchema, useGeneralSetting, useGetCurrentUserInfo } from '@/hooks/api';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { convertDateStringToFormattedDate } from '@/lib/utils';

const ProfilePage = () => {
  const [hasLogoChanged, setHasLogoChanged] = useState<boolean>(false);
  const [companyLogo, setCompanyLogo] = useState<any>();
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const { mutate: updateProfileFn, isLoading } = useGeneralSetting();
  const form = useForm<z.infer<typeof generalSettingSchema>>({
    resolver: zodResolver(generalSettingSchema),
    defaultValues: {
      full_name: '',
      city: '',
      state: '',
      timezone: '',
      phone: '',
      ideal_customer_profile: '',
    },
  });
  const { isLoading: isFetching } = useGetCurrentUserInfo({
    onSuccess: (data: any) => {
      form.reset({
        ...data.data,
        full_name: data.data.full_name ?? '',
        city: data.data.city ?? '',
        state: data.data.state ?? '',
        timezone: data.data.timezone ?? '',
        country: data.data.city ?? '',
        address: data.data.address ?? '',
        phone: data.data.phone ?? '',
        ideal_customer_profile: data.data.ideal_customer_profile ?? '',
        date_joined: convertDateStringToFormattedDate(data.data.date_joined),
      });
    },
  });

  function onSubmit(values: z.infer<typeof generalSettingSchema>) {
    const req = {
      ...values,
      company_logo: companyLogo,
    };
    if (
      typeof req.company_logo === 'string' ||
      req.company_logo === '' ||
      req.company_logo === undefined
    ) {
      delete req.company_logo;
    }
    checkAccount(() => {
      updateProfileFn(req);
      setHasLogoChanged(false);
    });
  }

  return (
    <>
      <PageHeader title="Profile Page">
        <></>
      </PageHeader>
      <Card className="max-w-[1400px] w-full p-10 gap-10 flex flex-col">
        <CardTitle className="text-gray-700">Information Details</CardTitle>
        {isFetching && <FormLoader />}
        {!isFetching && (
          <CardContent className="flex flex-col gap-5  -ml-5">
            <Form {...form}>
              <form className="flex flex-col  gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-12">
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="md:text-sm ">Company Name</FormLabel>
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="md:text-sm ">Contact No.</FormLabel>
                          <div className="m-0 md:max-w-sm w-full">
                            <FormControl>
                              <Input {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_logo"
                      render={({ field }) => (
                        <FormItem className="flex justify-between gap-3">
                          <FormLabel className="md:text-sm">Company Logo</FormLabel>
                          <div className="grid grid-cols-2 w-[384px]">
                            <SingleImageUpload
                              title="Choose File"
                              onImageUpload={(file) => {
                                setHasLogoChanged(true);
                                setCompanyLogo(file[0]);
                              }}
                              className="h-[50px] bg-white border border-neutral-300"
                            ></SingleImageUpload>

                            {((companyLogo &&
                              typeof companyLogo !== 'string' &&
                              URL.createObjectURL(companyLogo)) ||
                              field.value) && (
                              <img
                                src={
                                  (companyLogo &&
                                    typeof companyLogo !== 'string' &&
                                    URL.createObjectURL(companyLogo)) ||
                                  field.value
                                }
                                className="w-12 h-12"
                              />
                            )}
                            <div className="col-span-2 text-sm font-medium text-gray-500 flex gap-2 items-center">
                              <p>Max 3 mb (File type should be jpg, jpeg or png)</p>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="md:text-sm ">Company Sector</FormLabel>
                          <div className="m-0 md:max-w-sm w-full">
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="m-0 col-span-4">
                                  <div className="flex items-center gap-3">
                                    <SelectValue placeholder="Select ..." />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {COMPANY_SECTORS.map((sector, idx) => (
                                    <SelectItem value={sector} key={idx}>
                                      {sector}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="md:text-sm ">Company Size</FormLabel>
                          <div className="m-0 md:max-w-sm w-full">
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="m-0 col-span-4 ">
                                  <div className="flex items-center gap-3">
                                    <SelectValue placeholder="Select ..." />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {COMPANY_SIZES_EU.map((size, idx) => (
                                    <SelectItem value={size} key={idx}>
                                      {size}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Company Description */}
                    <FormField
                      control={form.control}
                      name="company_description"
                      render={({ field }) => (
                        <FormItem className="flex">
                          <FormLabel>Company Description</FormLabel>
                          <Textarea
                            placeholder="Please describe your company in few words."
                            className="col-span-4 w-[384px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />
                    {/* ICP */}
                    <FormField
                      control={form.control}
                      name="ideal_customer_profile"
                      render={({ field }) => (
                        <FormItem className="flex">
                          <FormLabel>Ideal Customer Profile(ICP)</FormLabel>
                          <Textarea
                            placeholder="Please describe your ICP in few words."
                            className="col-span-4 w-[384px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
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
                              <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date_joined"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="md:text-sm ">Date Created</FormLabel>
                          <div className="m-0 md:max-w-sm w-full">
                            <FormControl>
                              <Input {...field} disabled />
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
                          name="address"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <div className="m-0 md:max-w-sm w-full">
                                  <Input {...field} placeholder="Street address" />
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
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center gap-5 pr-5 pt-5">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    variant={'purple'}
                    disabled={!hasLogoChanged && !form.formState.isDirty}
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
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
    </>
  );
};

export default ProfilePage;
