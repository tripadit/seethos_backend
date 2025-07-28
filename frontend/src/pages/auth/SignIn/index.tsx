import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMixpanel } from 'react-mixpanel-browser';
import { Link, useNavigate } from 'react-router-dom';
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
import { signInSchema, useSignIn } from '@/hooks/api';
import { routes } from '@/routes/routes';

import { AuthLayout } from '../AuthLayout';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { status: signInStatus, mutate: signInFn } = useSignIn();
  const navigate = useNavigate();
  const mixpanel = useMixpanel();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof signInSchema>) {
    mixpanel.track('Sign In Initiated', {
      email: values.email,
    });
    signInFn(values);
  }
  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 md:justify-between gap-4">
        <div className="flex flex-col text-center md:text-left gap-1 md:gap-4">
          <h1 className=" hidden sm:block text-2xl leading-62 md:text-52 text-gray-700 font-semibold ">
            Welcome back!
          </h1>
          <p className="hidden sm:block text-sm md:text-lg text-gray-600">
            Sign In to Your Account: Access your personalized experience in just a few clicks!
          </p>
          <h1 className="text-gray-900 sm:hidden text-2xl md:text-6xl font-semibold md:leading-66">
            Log in to your account
          </h1>
          <p className="text-gray-500 sm:hidden mb-5 text-sm md:text-lg">
            Welcome back! Please enter your details.
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
                <div className="flex items-end justify-end">
                  <Link to={routes.forgetPassword}>
                    <p className="text-purple-500 w-max text-sm font-semibold">Forgot password?</p>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <Button
                  type="submit"
                  isLoading={signInStatus === 'loading' ? true : false}
                  variant="purple"
                  className="px-10 mt-5 sm:mt-0 sm:w-max py-6 text-base md:text-lg font-semibold"
                >
                  Sign in
                </Button>
                <p className="text-blueGray-500 text-sm text-center sm:text-left">
                  Don't have an account?{' '}
                  <Button
                    className="p-0 font-semibold text-purple-500"
                    onClick={() => {
                      navigate(routes.signnUp);
                    }}
                  >
                    {' '}
                    Sign up{' '}
                  </Button>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
