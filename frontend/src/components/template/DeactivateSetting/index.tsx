import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { CustomDialog } from '@/components/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/datePicker';
import { CFormItem, Form, FormField, FormLabel } from '@/components/ui/form';
import {
  deactiveSubscriptionSchema,
  useDeactiveAccount,
  useDeleteAccount,
  useGetCurrentUserInfo,
} from '@/hooks/api';
import queryClient from '@/utils/queryClient';

export const DeactivatedSetting = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activate, setActivate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { data } = useGetCurrentUserInfo();
  const toggleDeactiveModal = () => {
    setOpen(!open);
  };

  const toggleActivate = () => {
    setActivate(!activate);
  };

  const toggleDeleteAccount = () => {
    setOpenDelete(!openDelete);
  };

  const form = useForm<z.infer<typeof deactiveSubscriptionSchema>>({
    defaultValues: {
      from: new Date(),
    },
    resolver: zodResolver(deactiveSubscriptionSchema),
  });

  const { deactiveFn, activateFn } = useDeactiveAccount({
    onSuccess: () => {
      queryClient.invalidateQueries(['get-me']);
      if (open) {
        toggleDeactiveModal();
      }
      if (activate) {
        toggleActivate();
      }
    },
  });

  const {
    deleteAccountFn: { mutate: deleteAccountFn, isLoading },
  } = useDeleteAccount();

  const onSubmit: SubmitHandler<z.infer<typeof deactiveSubscriptionSchema>> = (value) => {
    deactiveFn.mutate({
      date: format(value.to, 'yyyy-MM-dd'),
    });
  };

  return (
    <div className="flex flex-col gap-10 w-[795px] ">
      {!data?.data.is_subscription_pause ? (
        <Card className="p-10 gap-5 flex flex-col">
          <div>
            <CardTitle className="text-gray-700 text-base">Deactivate Account?</CardTitle>
            <p className=" text-xs text-gray-600 font-medium">
              Deactivate your profile and chatbot subscriptions to your websites.
            </p>
          </div>
          <div className="h-[1px] bg-gray-200 w-full"></div>
          <CardContent className="flex flex-col gap-5 px-0 pb-0">
            <p className="text-sm text-gray-600">
              Deactivate your profile and chatbot subscriptions to your websites.
            </p>
            <Button onClick={toggleDeactiveModal} variant={'warning'} className="w-[167px]">
              Deactivate
            </Button>
            <p className="text-sm font-medium text-gray-600">
              Feel free to contact{' '}
              <span className="text-purple-500"> scalebuildsupport@gmail.com</span> with any
              questions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-10 gap-5 flex flex-col">
          <div>
            <CardTitle className="text-gray-700 text-base">Activate Account?</CardTitle>
            <p className=" text-xs text-gray-600 font-medium">
              Activate your profile and chatbot subscriptions to your websites.
            </p>
          </div>
          <div className="h-[1px] bg-gray-200 w-full"></div>
          <CardContent className="flex flex-col gap-5 px-0 pb-0">
            <p className="text-sm text-gray-600">
              Deactivate your profile and chatbot subscriptions to your websites.
            </p>
            <Button onClick={toggleActivate} variant={'purple'} className="w-[167px]">
              Activate
            </Button>
            <p className="text-sm font-medium text-gray-600">
              Feel free to contact{' '}
              <span className="text-purple-500"> scalebuildsupport@gmail.com</span> with any
              questions.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="p-10 gap-5 flex flex-col">
        <div>
          <CardTitle className="text-gray-700 text-base">Delete Account?</CardTitle>
          <p className=" text-xs text-gray-600 font-medium">
            Delete your profile, along with your authentication associations.
          </p>
        </div>
        <div className="h-[1px] bg-gray-200 w-full"></div>
        <CardContent className="flex flex-col gap-5 px-0 pb-0">
          <p className="text-sm text-gray-600">
            Delete any and all content you have, such as articles, comments, your reading list or
            chat messages. Allow your username to become available to anyone.
          </p>
          <Button onClick={toggleDeleteAccount} variant={'destructive'} className="w-[167px]">
            Delete Account
          </Button>
          <p className="text-sm font-medium text-gray-600">
            Feel free to contact{' '}
            <span className="text-purple-500"> scalebuildsupport@gmail.com</span> with any
            questions.
          </p>
        </CardContent>
      </Card>
      <CustomDialog
        isOpen={open}
        onClose={toggleDeactiveModal}
        actions={
          <div className="grid grid-cols-2 w-full gap-5">
            <Button variant="outline" onClick={toggleDeactiveModal}>
              Discard
            </Button>
            <Button
              variant="purple"
              onClick={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isDirty}
              isLoading={deactiveFn.isLoading}
            >
              Save Changes
            </Button>
          </div>
        }
        className="w-[400px]"
        body={
          <>
            <Form {...form}>
              <div className="flex flex-col items-center">
                <div className="rounded-full p-2 bg-warning-50 mb-4">
                  <div className="rounded-full p-2 bg-warning-100">
                    <AlertTriangle className="text-warning-600" />
                  </div>
                </div>
                <h1 className="text-gray-700 text-lg font-semibold">Deactive Account?</h1>
                <p className="text-sm font-normal text-gray-500 text-center">
                  Please select the dates below for the duration of deactivation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-10 mb-5">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field, formState }) => (
                    <CFormItem className="w-full flex flex-col">
                      <FormLabel className="md:text-lg ">Form</FormLabel>
                      <DatePicker
                        disabled={true}
                        {...field}
                        value={field.value ?? formState.defaultValues?.from}
                      />
                    </CFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <CFormItem className="w-full flex flex-col">
                      <FormLabel className="md:text-lg ">To</FormLabel>
                      <DatePicker {...field} />
                    </CFormItem>
                  )}
                />
              </div>
            </Form>
          </>
        }
      />
      <CustomDialog
        isOpen={activate}
        onClose={toggleActivate}
        title="Activate Account"
        subTitle="Are you sure you want to activate your account?"
        actions={
          <>
            <Button variant="outline" onClick={toggleDeactiveModal}>
              Cancel
            </Button>
            <Button
              variant="purple"
              onClick={() => activateFn.mutate()}
              isLoading={activateFn.isLoading}
            >
              Activate
            </Button>
          </>
        }
      />
      <CustomDialog
        isOpen={openDelete}
        onClose={toggleDeleteAccount}
        title="Delete Account"
        subTitle="Are you sure you want to delete your account?"
        actions={
          <>
            <Button variant="outline" onClick={toggleDeleteAccount}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteAccountFn()} isLoading={isLoading}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
};
