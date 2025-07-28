import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ArrowBlockLeft } from '@/assets/icons';
import { SingleImageUpload, Stepper } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMPANY_SECTORS } from '@/global/appConstants';
import { CreateBotFormStep, STEPS } from '@/pages/assistant/constant/common';
import { useUpdateCompanyDetails } from '@/pages/assistant/hooks/addAssistance';

interface IOnboardingDialogProps {
  isOpen: boolean;
  onClose: (args: boolean) => void;
}
const UserOnboardingSchema = z.object({
  address: z.string().optional(),
  company_name: z.string().optional(),
  company_logo: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (file instanceof File) {
          // Assuming file is a File object
          const fileSizeInMB = file.size / (1024 * 1024);
          return fileSizeInMB <= 3;
        }
        return true;
      },
      {
        message: 'File size should be less than or equal to 2MB',
      },
    ),
  company_sector: z.string().optional(),
});
type UserOnboardingType = z.infer<typeof UserOnboardingSchema>;
export const UserOnboardingForm = ({ isOpen, onClose }: IOnboardingDialogProps) => {
  const [companyLogo, setCompanyLogo] = useState<any>();
  const [activeStep] = useState<CreateBotFormStep>(CreateBotFormStep['Company Details']);
  const updateCompanyDetails = useUpdateCompanyDetails();
  const form = useForm<UserOnboardingType>({
    resolver: zodResolver(UserOnboardingSchema),
    defaultValues: {
      company_name: '',
      company_sector: '',
      company_logo: '',
      address: '',
    },
  });

  const onSubmit: SubmitHandler<UserOnboardingType> = (values: UserOnboardingType) => {
    const onboardValues = {
      ...values,
      company_logo: companyLogo,
      first_time_login: false,
    };
    const formData = new FormData();
    Object.entries(onboardValues).map(([key, val]: any) => {
      if (!val) {
        return;
      }
      formData.append(key, val);
    });
    updateCompanyDetails.mutate(formData);

    // if (typeof companyLogo === 'string' || companyLogo === undefined) {
    //   delete onboardValues.company_logo;
    // }
    // updateUserFn(onboardValues, {
    //   onSuccess: () => {
    //     toast({
    //       variant: 'success',
    //       title: 'Company detail updated succesfully!',
    //     });
    //     refetch();
    //     onClose();
    //     appOnboardingDashboardDriver.drive();
    //   },
    // });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[838px] max-h-[90vh] overflow-auto">
          <Form {...form}>
            <div className="flex flex-row items-center justify-center">
              <div className="max-w-[582px] w-full">
                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                  Let's fill in your business details
                </h1>
                <div className="flex flex-row gap-2 items-center">
                  <div className="h-[8px] w-full bg-[#EAECF0] rounded">
                    <div className="bg-purple-500 w-10 rounded-full h-full"></div>
                  </div>
                  <p className="font-bold text-sm text-black/75">10%</p>
                </div>
              </div>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3">
              <div>
                <Stepper
                  steps={STEPS}
                  activeStep={activeStep + 1}
                  onStepClick={() => {}}
                  className="col-span-2 mt-2 ml-2 h-[100px]"
                  itemClassName="after:h-5"
                />
              </div>
              <div className="grid gap-4 py-2 col-span-2">
                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:text-sm ">Business Name</FormLabel>
                      <div className="m-0 md:max-w-sm w-full flex flex-col gap-1">
                        <Input
                          id="name"
                          placeholder="Enter your business name"
                          className="col-span-4"
                          {...field}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Contact No */}
                {/* <FormField
                  control={form.control}
                  name="contact_no"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-4">
                      <Label htmlFor="username" className="col-span-2 text-left">
                        Contact No.
                      </Label>
                      <Input
                        id="username"
                        placeholder="Enter your contact number"
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                /> */}

                {/* Company Sector */}
                <FormField
                  control={form.control}
                  name="company_sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:text-sm ">Business Type</FormLabel>
                      <div className="m-0 md:max-w-sm w-full flex flex-col gap-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="m-0 col-span-4 w-full">
                            <div className="flex items-center gap-3 w-full">
                              <SelectValue placeholder="Select business type" />
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
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:text-sm ">Location</FormLabel>
                      <div className="m-0 md:max-w-sm w-full flex flex-col gap-1">
                        <Input
                          id="name"
                          placeholder="Enter your location"
                          className="col-span-4"
                          {...field}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Company Logo */}
                <FormField
                  control={form.control}
                  name="company_logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:text-sm ">Business Logo</FormLabel>
                      <div className="m-0 md:max-w-sm w-full flex flex-col gap-1">
                        <div className="grid grid-cols-2 gap-2 ">
                          <SingleImageUpload
                            title="Choose File"
                            onImageUpload={(file) => {
                              field.onChange(file[0]);
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
                              className="w-12 h-12 object-contain"
                            />
                          )}
                          <div className="col-span-2 text-sm font-medium text-gray-500 flex gap-2 items-center">
                            <p>Max 3 mb (File type should be jpg, jpeg or png)</p>
                          </div>
                          <FormMessage className="w-full" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormItem>
                  <div></div>
                  <div className="m-0 md:max-w-sm w-full flex flex-col gap-1">
                    <div className="flex items-center gap-3 ">
                      {/* <Button
                        onClick={handleSkip}
                        disabled={userUpdateStatus === 'loading'}
                        variant="outline"
                      >
                        <ArrowBlockLeft /> Back
                      </Button> */}
                      <Button
                        type="submit"
                        variant="purple"
                        isLoading={updateCompanyDetails.isLoading}
                      >
                        <ArrowBlockLeft className="-rotate-180" />
                        Next
                      </Button>
                    </div>
                  </div>
                </FormItem>

                {/* Company Size */}
                {/* <FormField
                  control={form.control}
                  name="company_size"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-4">
                      <Label htmlFor="username" className="col-span-2 text-left">
                        Company Size
                      </Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    </FormItem>
                  )}
                /> */}

                {/* Company Description */}
                {/* <FormField
                  control={form.control}
                  name="company_description"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-4">
                      <Label htmlFor="username" className="col-span-2 text-left">
                        Company Description
                      </Label>
                      <Textarea
                        placeholder="Please describe what your company/website is about."
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                /> */}

                {/* Company Description */}
                {/* <FormField
                  control={form.control}
                  name="ideal_customer_profile"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-4">
                      <Label htmlFor="username" className="col-span-2 text-left">
                        Ideal Customer Profile
                      </Label>
                      <Textarea
                        placeholder="Describe your ideal customer"
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                /> */}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
