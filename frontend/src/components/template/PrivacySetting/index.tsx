import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { EyeCloseIcon, EyeOpenIcon, SaveIcon } from '@/assets/icons';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { PasswordInput } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { changePasswordSchema, useChangePassword } from '@/hooks/api';
import { useCheckAccount } from '@/hooks/useCheckAccount';

export const PrivacySetting = () => {
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { isLoading, mutate } = useChangePassword({
    onSuccess: () => {
      form.reset({ confirm_password: '', new_password: '', old_password: '' });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof changePasswordSchema>> = (values) => {
    checkAccount(() => {
      mutate(values);
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Card className="flex-1 p-10 gap-10 flex flex-col">
      <CardTitle className="text-gray-700">Privacy Settings</CardTitle>
      <CardContent className="flex flex-col gap-5">
        <Form {...form}>
          <form className="flex flex-col gap-5 -ml-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:text-sm">Current Password</FormLabel>
                  <div className="m-0 md:max-w-sm w-full">
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter current password"
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
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:text-sm">New Password</FormLabel>
                  <div className="m-0 md:max-w-sm w-full">
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password"
                        type={showNewPassword ? 'text' : 'password'}
                        {...field}
                        inputRightElem={
                          showNewPassword ? (
                            <EyeOpenIcon onClick={toggleNewPassword} className="cursor-pointer" />
                          ) : (
                            <EyeCloseIcon onClick={toggleNewPassword} className="cursor-pointer" />
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:text-sm">Confirm Password</FormLabel>
                  <div className="m-0 md:max-w-sm w-full">
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter confirm password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        inputRightElem={
                          showConfirmPassword ? (
                            <EyeOpenIcon
                              onClick={toggleConfirmPassword}
                              className="cursor-pointer"
                            />
                          ) : (
                            <EyeCloseIcon
                              onClick={toggleConfirmPassword}
                              className="cursor-pointer"
                            />
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="py-5 flex flex-col gap-2">
                      <h6 className="text-sm text-gray-700 font-bold">Password requirements:</h6>
                      <p className="text-xs text-gray-600 font-medium">
                        Ensure that these requirements are met:
                      </p>
                      <ul className="text-xs text-gray-600 font-medium list-disc list-inside pl-2">
                        <li>Minimum 8 characters long - the more, the better</li>
                        <li> At least one lowercase character </li>
                        <li>At least one uppercase character</li>
                        <li>At least one number, symbol, or whitespace character</li>
                      </ul>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-center items-center gap-5 pr-5 pt-5">
              <Button
                disabled={!form.formState.isDirty}
                variant={'outline'}
                onClick={() => {
                  form.reset({
                    confirm_password: '',
                    new_password: '',
                    old_password: '',
                  });
                }}
              >
                <X />
                Cancel
              </Button>
              <Button
                variant={'purple'}
                type="submit"
                isLoading={isLoading}
                disabled={!form.formState.isDirty}
              >
                <SaveIcon />
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
    </Card>
  );
};
