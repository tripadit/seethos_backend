import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMixpanel } from 'react-mixpanel-browser';
import { Link } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
import { useRouteQuery } from '@/hooks';
import { signUpSchema, useSignUp } from '@/hooks/api';
import { routes } from '@/routes/routes';

import { AuthLayout } from '../AuthLayout';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const email = useRouteQuery('email');
  const { isLoading, mutate: signUpFn, subscribe } = useSignUp();
  const mixpanel = useMixpanel();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: email ?? '',
      full_name: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    mixpanel.track('Sign Up Initiated', {
      data: values,
    });
    signUpFn(values);
  }
  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 md:justify-between gap-4">
        <div className="flex flex-col gap-1 md:gap-4">
          <h1 className="text-center sm:text-left text-2xl md:text-52 text-gray-700 font-semibold leading-62">
            Create an account!
          </h1>
          <p className="text-center sm:text-left text-sm md:text-lg text-gray-600">
            Start Your Journey: Sign up now for a seamless experience tailored just for you!
          </p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5">
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
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <CFormItem>
                      <FormLabel className="md:text-lg ">Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </CFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <CFormItem>
                      <FormLabel className="md:text-lg">Password</FormLabel>
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
              </div>
              <div className="flex flex-col gap-5 mt-4">
                <Button
                  type="submit"
                  isLoading={subscribe.isLoading || isLoading}
                  variant="purple"
                  className="px-10 sm:w-max py-6 text-base md:text-lg font-semibold"
                >
                  Sign Up
                </Button>
                <p className="text-blueGray-500 text-center sm:text-left text-sm">
                  Already have an account?{' '}
                  <Link to={routes.signIn} className="font-semibold text-purple-500">
                    {' '}
                    Sign in{' '}
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
