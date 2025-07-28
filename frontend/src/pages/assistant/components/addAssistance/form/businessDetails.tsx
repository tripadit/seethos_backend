import { UseFormReturn } from 'react-hook-form';

import { ArrowBlockLeft } from '@/assets/icons';
import { SingleImageUpload } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BusinessDetailsSchemaType } from '@/pages/assistant/routes/addAssistance';
interface BusinessDetailsProps {
  handleNextBusinessDetails: (tab: '1' | '2' | null, isChangeStep?: boolean) => void;
  form: UseFormReturn<BusinessDetailsSchemaType>;
}
export const BusinessDetails = ({ handleNextBusinessDetails, form }: BusinessDetailsProps) => {
  return (
    <div>
      <Form {...form}>
        <div className="grid gap-4 py-2 col-span-2">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Business Name</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <Input
                    id="name"
                    placeholder="Enter your business name"
                    className="col-span-4"
                    {...field}
                  />
                  <FormMessage className="w-full" />
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

          <FormField
            control={form.control}
            name="company_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Business Description</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <Input
                    id="name"
                    placeholder="Briefly describe your business."
                    className="col-span-4"
                    {...field}
                  />
                  <FormMessage className="w-full" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ideal_customer_profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Ideal Client Profile</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <Input
                    id="name"
                    placeholder="Who is your ideal customer?"
                    className="col-span-4"
                    {...field}
                  />
                  <FormMessage className="w-full" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Location</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <Input
                    id="name"
                    placeholder="Enter your business location"
                    className="col-span-4"
                    {...field}
                  />
                  <FormMessage className="w-full" />
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
                <FormLabel className="text-sm text-gray-700">Business Logo</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <div className="grid grid-cols-2 gap-3 col-span-4">
                    <SingleImageUpload
                      title="Choose File"
                      onImageUpload={(file) => {
                        field.onChange(file[0]);
                      }}
                      className="h-[50px] bg-white border border-neutral-300"
                    ></SingleImageUpload>

                    {field.value && (
                      <img
                        src={
                          typeof field?.value !== 'string'
                            ? URL.createObjectURL(field.value)
                            : field.value
                        }
                        className="w-12 h-12"
                      />
                    )}
                    <div className="flex flex-col gap-1 w-full col-span-2">
                      <div className=" text-sm font-medium text-gray-500 flex gap-2 items-center">
                        <p>Max 3 mb (File type should be jpg, jpeg or png)</p>
                      </div>
                      <FormMessage className="w-full" />
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormItem>
            <div></div>
            <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
              <div className="flex items-center gap-3 ">
                <Button
                  type="submit"
                  variant="purple"
                  onClick={() => {
                    handleNextBusinessDetails('2');
                  }}
                  icon={<ArrowBlockLeft className="-rotate-180" />}
                >
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
      </Form>
    </div>
  );
};
