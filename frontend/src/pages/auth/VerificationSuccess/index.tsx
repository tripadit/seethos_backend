import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouteQuery } from '@/hooks';
import { useForgetPassword } from '@/hooks/api';

import { AuthLayout } from '../AuthLayout';

const VerificationSuccess = () => {
  const { toast } = useToast();
  const email = useRouteQuery('email') as string;
  const { status: forgetPWStatus, mutate: forgetPasswordFn } = useForgetPassword();

  const handleResendLink = () => {
    if (email) {
      forgetPasswordFn({ email });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
      });
    }
  };
  return (
    <AuthLayout>
      <div className="flex flex-col  gap-4">
        <div className="flex sm:flex-1 flex-col gap-1 md:gap-4">
          <h1 className="text-center sm:text-left text-2xl md:text-52 text-gray-700 font-semibold leading-62">
            Success!!
          </h1>
          <p className="text-center sm:text-left text-sm md:text-lg text-gray-600">
            Your email has been verified.
          </p>
          <div className="flex flex-1 justify-between flex-col ">
            <div className="flex flex-col text-gray-700 font-medium mt-5 md:mt-10 gap-3 md:gap-5">
              <p className="text-center sm:text-left text-sm md:text-lg">
                You’re almost there! We sent an email to {email}
              </p>
              <p className="text-center sm:text-left text-sm md:text-lg">
                Just click on the link in that email to complete your signup. If you don’t see it,
                you may need to check your spam folder.{' '}
              </p>
            </div>
            <Button
              onClick={handleResendLink}
              isLoading={forgetPWStatus === 'loading' ? true : false}
              variant="purple"
              className="px-10 mt-10 sm:mt-0 sm:w-max py-6 text-base md:text-lg font-semibold"
            >
              Resend Email
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerificationSuccess;
