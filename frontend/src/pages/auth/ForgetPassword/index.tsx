import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import { forgetPasswordSchema, useForgetPassword } from '@/hooks/api';
import { routes } from '@/routes/routes';

import { AuthLayout } from '../AuthLayout';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { status: forgetPWStatus, mutate: forgetPasswordFn } = useForgetPassword();
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof forgetPasswordSchema>) {
    forgetPasswordFn(values, {
      onSettled: () => {
        navigate(routes.verificationSuccess + `\?email=${values.email}`);
      },
    });
  }
  return (
    <AuthLayout>
      <div className="flex flex-col  gap-4">
        <div className="flex flex-1 flex-col gap-1 md:gap-4">
          <h1 className="text-center sm:text-left text-2xl md:text-52 text-gray-700 font-semibold leading-62">
            Forgot your password?
          </h1>
          <p className="text-center sm:text-left text-sm md:text-lg text-gray-600">
            Please confirm your email address below and we will send you a verification code.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 gap-5 md:justify-between"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <CFormItem>
                    <FormLabel className="md:text-lg ">Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </CFormItem>
                )}
              />
              <Button
                type="submit"
                isLoading={forgetPWStatus === 'loading' ? true : false}
                variant="purple"
                className="px-10 sm:w-max py-6 text-base md:text-lg font-semibold"
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

export default ForgetPassword;
