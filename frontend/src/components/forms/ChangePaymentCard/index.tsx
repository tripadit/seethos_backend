import { CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CONFIG } from '@/global/config';
import { useChangePaymentCard } from '@/hooks/api';

const stripePromise = loadStripe(CONFIG.STRIPE_PUBLIC_KEY);

export const StripeProvider = ({ children }: { children: React.ReactNode }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);
export const ChangePaymentCard = ({ coloseModal }: { coloseModal: () => void }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="w-[759px] flex flex-col gap-5 z-50">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-gray-700 text-2xl font-bold">Add new card</h1>
            <p className="text-gray-600 text-sm font-medium">
              All major credit / debit cards acepted.
            </p>
          </div>
          <Button onClick={coloseModal} size={'icon'} className="text-gray-600">
            <X />
          </Button>
        </div>

        <div className="h-[1px] bg-gray-200 w-full"></div>
        <StripeProvider>
          <PaymentFrom coloseModal={coloseModal} />
        </StripeProvider>
      </div>
    </Elements>
  );
};

const PaymentFrom = ({ coloseModal }: { coloseModal: () => void }) => {
  const { handleCardChange, isLoading } = useChangePaymentCard({
    onSuccess: () => {
      coloseModal();
    },
  });

  return (
    <>
      <div className="py-5">
        <CardElement />
      </div>
      {/* <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <CFormItem>
                <FormLabel className="md:text-lg ">Card Number</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="Card Number" />
                </FormControl>
                <FormMessage />
              </CFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvc"
            render={({ field }) => (
              <CFormItem>
                <FormLabel className="md:text-lg ">CVC Code</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="CVC code" />
                </FormControl>
                <FormMessage />
              </CFormItem>
            )}
          />
        </div>
        <div className=" grid grid-cols-4 gap-5">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="cardHolderName"
              render={({ field }) => (
                <CFormItem>
                  <FormLabel className="md:text-lg ">Cardholder Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Cardholder Name" />
                  </FormControl>
                  <FormMessage />
                </CFormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="exp_month"
            render={({ field }) => (
              <CFormItem>
                <FormLabel className="md:text-lg ">Month</FormLabel>
                <FormControl>
                  <div className="m-0 md:max-w-sm w-full">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <div className="flex items-center gap-3">
                          <SelectValue placeholder="Select Month" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 32 }, (_, index) => index + 1).map((month, idx) => (
                          <SelectItem value={month.toString()} key={month}>
                            {month}
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
            name="exp_year"
            render={({ field }) => (
              <CFormItem>
                <FormLabel className="md:text-lg ">Month</FormLabel>
                <FormControl>
                  <div className="m-0 md:max-w-sm w-full">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <div className="flex items-center gap-3">
                          <SelectValue placeholder="Select Year" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 100 }, (_, index) => 1990 + index).map((year) => (
                          <SelectItem value={year.toString()} key={year}>
                            {year}
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
        </div>
        <Button type="submit" variant={'purple'} className="mt-5">
          Save Card
        </Button>
      </form> */}
      <Button variant={'purple'} isLoading={isLoading} onClick={handleCardChange}>
        Save Card
      </Button>
    </>
  );
};
