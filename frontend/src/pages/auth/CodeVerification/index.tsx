import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { OTPInput } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { CFormItem, Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { routes } from '@/routes/routes';

import { AuthLayout } from '../AuthLayout';
import { signInSchema } from './schema';

const CodeVerificcation = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      otp: '',
    },
  });

  function onSubmit() {
    navigate(routes.dashboard);
  }
  return (
    <AuthLayout>
      <div className="flex flex-col  gap-4">
        <div className="flex flex-1 flex-col gap-1 md:gap-4">
          <h1 className="text-2xl md:text-52 text-gray-700 font-semibold leading-62">
            Verify Code
          </h1>
          <p className="text-sm md:text-lg text-gray-600">Code is sent to emailaddress@mail.com</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 gap-5 mt-6 md:justify-between"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <CFormItem>
                    <FormControl>
                      <OTPInput autoFocus onChangeOTP={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </CFormItem>
                )}
              />
              <Button
                type="submit"
                variant="purple"
                className="px-10 w-max py-6 text-base md:text-lg font-semibold"
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CodeVerificcation;
