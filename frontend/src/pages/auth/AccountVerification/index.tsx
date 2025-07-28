import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useRouteQuery } from '@/hooks';
import { useAccountverify, useResendVerification } from '@/hooks/api';
import { routes } from '@/routes/routes';

import { AuthLayout } from '../AuthLayout';

const AccountVerification = () => {
  const navigate = useNavigate();
  const email = useRouteQuery('email') as string;
  const token = useRouteQuery('token') as string;
  const { isLoading, isError, isSuccess } = useAccountverify();
  const { isLoading: isResending, isSuccess: isSuccessResend, resend } = useResendVerification();

  return (
    <AuthLayout>
      {(isLoading || isResending) && !isError && !isSuccess && !isSuccessResend && (
        <div className="flex flex-1 flex-col  justify-center items-center h-full">
          <div className="flex justify-center items-center flex-row gap-5">
            <h1 className="text-3xl text-gray-700 font-semibold animate-pulse">
              {isResending && token === null ? 'Sending Verification link' : 'Verifying Account'}
            </h1>
            <Loader2 className="animate-spin duration-2s text-gray-700" size={30} />
          </div>
        </div>
      )}

      {isSuccess && email && token && (
        <div className="flex flex-col  gap-4">
          <div className="flex flex-1 flex-col gap-1 md:gap-4">
            <h1 className="text-2xl md:text-52 text-gray-700 font-semibold leading-62">
              Account Verified
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Your account has been successfully verified
            </p>
            <div className="flex flex-1 justify-between flex-col ">
              <div className="flex flex-col text-gray-700 font-medium mt-5 md:mt-10 gap-3 md:gap-5">
                <p className="text-sm md:text-lg">Thank you for verifying your account with us.</p>
                <p className="text-sm md:text-lg">
                  Please continue with login to access your account.
                </p>
              </div>
              <Button
                onClick={() => {
                  navigate(routes.signIn, {
                    replace: true,
                  });
                }}
                variant="purple"
                className="px-10 w-max py-6 text-base md:text-lg font-semibold"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      )}
      {((email && !token && isSuccessResend) || (email && token && isError)) && (
        <div className="flex flex-col  gap-4">
          <div className="flex flex-1 flex-col gap-1 md:gap-4">
            <h1 className="text-2xl md:text-52 text-gray-700 font-semibold leading-62">
              Account Verification
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Verification link has been sent to {email}{' '}
            </p>
            <div className="flex flex-1 justify-between flex-col ">
              <div className="flex flex-col text-gray-700 font-medium mt-5 md:mt-10 gap-3 md:gap-5">
                <p className="text-sm md:text-lg">
                  You’re almost there! We sent an email to {email}
                </p>
                <p className="text-sm md:text-lg">
                  Just click on the link in that email to complete your account verification. If you
                  don’t see it, you may need to check your spam folder.{' '}
                </p>
              </div>
              <Button
                onClick={() => resend.mutate()}
                isLoading={resend.isLoading}
                variant="purple"
                className="px-10 w-max py-6 text-base md:text-lg font-semibold"
              >
                Resend Verification Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default AccountVerification;
