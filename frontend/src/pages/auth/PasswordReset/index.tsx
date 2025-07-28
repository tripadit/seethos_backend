import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { EyeCloseIcon, EyeOpenIcon } from '@/assets/icons';
import { PasswordInput } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import {
  CFormItem,
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useRouteQuery } from '@/hooks';
import { resetPasswordSchema, useResetPassword } from '@/hooks/api';

import { AuthLayout } from '../AuthLayout';

const PasswordReset = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const email = useRouteQuery('email') as string;
  const token = useRouteQuery('token') as string;
  const { status: resetPWStatus, mutate: resetPasswordFn } = useResetPassword();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (email && token) {
      resetPasswordFn(values);
    } else {
      toast({
        variant: 'destructive',
        title: 'Reset password link sent to your email.',
      });
    }
  }

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      token,
      new_password: '',
    },
  });
  return (
    <AuthLayout>
      <div className="flex flex-col  gap-4">
        <div className="flex flex-1 flex-col gap-1 md:gap-4">
          <h1 className="text-center sm:text-left text-2xl md:text-52 text-gray-700 font-semibold leading-62">
            Verification
          </h1>
          <div className="flex flex-1 justify-between flex-col ">
            <div className="flex flex-col text-gray-700 font-medium mt-5 md:mt-10 gap-3 md:gap-5">
              <p className="text-center sm:text-left text-sm md:text-lg">
                Just a step away, Click 'Verify' to confirm your identity and proceed with resetting
                your password securely.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col mt-10 flex-1 gap-5 md:justify-between"
              >
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <CFormItem>
                      <FormLabel className="md:text-lg"> New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          inputRightElem={
                            showPassword ? (
                              <EyeOpenIcon onClick={togglePassword} className="cursor-pointer" />
                            ) : (
                              <EyeCloseIcon onClick={togglePassword} className="cursor-pointer" />
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </CFormItem>
                  )}
                />

                <Button
                  type="submit"
                  isLoading={resetPWStatus === 'loading' ? true : false}
                  variant="purple"
                  className="px-10 sm:w-max py-6 text-base md:text-lg font-semibold"
                >
                  Verify
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PasswordReset;
