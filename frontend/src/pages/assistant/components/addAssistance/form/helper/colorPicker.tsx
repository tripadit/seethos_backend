import React from 'react';
import { SketchPicker } from 'react-color';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
interface IColorPickerProps {
  field: any;
}
export const ColorPicker = ({ field }: IColorPickerProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [color, setColor] = React.useState<string>('#fff');
  React.useEffect(() => {
    if (field.value) {
      setColor(field.value);
    }
  }, [field.value]);
  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger className="w-full">
        <Input
          id="name"
          onClick={() => setOpen(true)}
          placeholder="Enter your company name"
          className="col-span-4 pl-8 w-full cursor-pointer"
          {...field}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex flex-col w-[300px]">
          <SketchPicker
            presetColors={['#25D366', '#075E54', '#34B7F1', '#00B2FF', '#006AFF', '#7F34A1']}
            color={color}
            onChange={(color) => {
              setColor(color.hex);
            }}
            onChangeComplete={(color) => {
              setColor(color.hex);
            }}
          />
          <div className="flex flex-row gap-2 justify-end px-2 py-1">
            <Button
              variant={'secondary'}
              onClick={() => {
                setOpen(false);
              }}
              className="h-[28px] text-sm font-medium w-fit"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                field.onChange(color);
                setOpen(false);
              }}
              variant={'purple'}
              className="h-[28px] text-sm font-medium w-fit"
            >
              Save
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
