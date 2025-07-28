import React, { useState } from 'react';

import { CustomDialog } from '@/components/dialog';
import { AddBillingAddress, FormLoader } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { IBillingAddress, useDeleteBillingAddress, useFetchBillingAddress } from '@/hooks/api';

export const BillingAddress = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedData, setSelecetedData] = useState<IBillingAddress>();
  const { data, isLoading } = useFetchBillingAddress();

  const toggleModal = () => {
    if (selectedData) {
      setSelecetedData(undefined);
    }
    setOpen(!open);
  };

  const editHandler = (data: IBillingAddress) => {
    setSelecetedData(data);
    setOpen(true);
  };

  return (
    <>
      <Card className="p-10 gap-5 flex flex-col">
        <CardTitle className="text-gray-700 text-base">Billing address</CardTitle>

        <div className="h-[1px] bg-gray-200 w-full"></div>
        {isLoading && <FormLoader />}
        {!isLoading &&
          data?.data.map((el) => (
            <BillingAddressCard key={el.id} {...el} editHandler={() => editHandler(el)} />
          ))}

        <div className="h-[1px] bg-gray-200 w-full"></div>
        <Button
          variant={'purple'}
          className="w-[162px] whitespace-nowrap"
          size={'lg'}
          onClick={toggleModal}
        >
          Add New Address
        </Button>
      </Card>
      <CustomDialog
        isOpen={open}
        isHideHeader={true}
        onClose={() => setOpen(false)}
        className="max-w-[810px]"
        body={<AddBillingAddress selectedData={selectedData} coloseModal={toggleModal} />}
      />
    </>
  );
};

const BillingAddressCard = (props: IBillingAddress & { editHandler: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isLoading } = useDeleteBillingAddress();
  const toggleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <div className="flex flex-row gap-2 items-start flex-1">
        <Checkbox className="rounded-full" />
        <div className="flex flex-col gap-4 flex-1">
          <h1 className="text-base text-gray-700 font-bold">Shipping Billing Address </h1>
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-1">
              <h5 className="text-sm font-medium text-gray-700">{props.country}</h5>
              <p className="text-sm font-normal text-gray-600">
                {props.city}, {props.state} {props.zip_code}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h5 className="text-sm font-normal text-gray-600">
                Email: <span className="text-purple-600">test@gmail.com</span>
              </h5>
              {props.phone && (
                <h5 className="text-sm font-normal text-gray-600">Phone: {props.phone}</h5>
              )}
            </div>
          </div>
          <div className="flex fle-row gap-5">
            <Button
              onClick={props.editHandler}
              variant={'link'}
              className="text-gray-600 font-medium px-0 underline"
            >
              Edit
            </Button>
            <Button
              onClick={toggleOpen}
              variant={'link'}
              className="text-gray-600 font-medium px-0 underline"
            >
              Delete
            </Button>
            {/* {props.isDefault ? (
            <Button variant={'link'} className="text-gray-600 font-medium px-0 underline">
              Remove as Default Billing
            </Button>
          ) : (
            <Button variant={'link'} className="text-gray-600 font-medium px-0 underline">
              Set as Default
            </Button>
          )} */}
          </div>
        </div>
      </div>
      <CustomDialog
        isOpen={open}
        onClose={toggleOpen}
        title="Delete Billing Address"
        subTitle="Are you sure you want to delete billing address"
        actions={
          <>
            <Button variant="outline" onClick={toggleOpen}>
              Cancel
            </Button>
            <Button variant="purple" onClick={() => mutate(props.id)} isLoading={isLoading}>
              Delete
            </Button>
          </>
        }
      />
    </>
  );
};
