import { zodResolver } from '@hookform/resolvers/zod';
import { FlagIcon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  CFormItem,
  Form,
  FormControl,
  FormField,
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
import { COUNTRYLIST } from '@/global/appConstants';
import { IBillingAddress } from '@/hooks/api';
import {
  billingAddressSchema,
  useAddBillingAddress,
} from '@/hooks/api/profileSetting/useAddBillingAddress';

export const AddBillingAddress = ({
  coloseModal,
  selectedData,
}: {
  coloseModal: () => void;
  selectedData?: IBillingAddress;
}) => {
  const form = useForm<z.infer<typeof billingAddressSchema>>({
    resolver: zodResolver(billingAddressSchema),
  });
  const { addMutate, editMutate } = useAddBillingAddress({
    onAddSuccess: () => {
      coloseModal();
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof billingAddressSchema>> = (data) => {
    if (selectedData) {
      editMutate.mutate({ postData: data, id: selectedData.id });
    } else {
      addMutate.mutate(data);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-gray-700 text-2xl font-bold">Billing Address</h1>
          <p className="text-gray-600 text-sm font-medium">
            Please provide the billing address with the credit card you’ve provided.
          </p>
        </div>
      </div>

      <div className="h-[1px] bg-gray-200 w-full"></div>
      <Form {...form}>
        <form className="flex flex-col gap-5 " onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <CFormItem className="w-full">
                <FormLabel className="md:text-lg ">Country</FormLabel>
                <FormControl>
                  <div className="m-0  w-full">
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
              </CFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <CFormItem>
                <FormLabel className="md:text-lg ">Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Address" />
                </FormControl>
                <FormMessage />
              </CFormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <CFormItem>
                  <FormLabel className="md:text-lg ">City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City" />
                  </FormControl>
                  <FormMessage />
                </CFormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <CFormItem>
                  <FormLabel className="md:text-lg ">Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phone number" />
                  </FormControl>
                  <FormMessage />
                </CFormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <CFormItem>
                  <FormLabel className="md:text-lg ">State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="State" />
                  </FormControl>
                  <FormMessage />
                </CFormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <CFormItem>
                  <FormLabel className="md:text-lg ">Zip / Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Zip / Postal Code" />
                  </FormControl>
                  <FormMessage />
                </CFormItem>
              )}
            />
          </div>

          <Button
            variant={'destructive'}
            type="submit"
            isLoading={addMutate.isLoading}
            disabled={!form.formState.isDirty}
          >
            Save Address
          </Button>
        </form>
      </Form>
    </div>
  );
};
