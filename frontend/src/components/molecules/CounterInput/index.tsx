import { ChangeEvent } from 'react';

import { Input, InputProps } from '@/components/ui/input';
import { Textarea, TextareaProps } from '@/components/ui/textarea';

interface ICounterInputProps extends InputProps {
  charLimit?: number;
}

interface ICounterTextAreaProps extends TextareaProps {
  charLimit?: number;
}

export const CounterInput: React.FC<ICounterInputProps> = ({
  charLimit = 255,
  onChange,
  value,
  ...rest
}: ICounterInputProps) => {
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === null) {
      onChange?.(e);
      return;
    }
    if (
      (typeof value === 'string' &&
        newValue.length <= charLimit &&
        newValue.length >= (value as string).length) ||
      newValue.length < (value as string)?.length
    ) {
      onChange?.(e);
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Input type="text" onChange={handleValueChange} {...rest} value={value} />
      <p className="self-end text-xs text-gray-400 !placeholder:text-gray-300">
        {(typeof value === 'string' && value?.length) || 0}/{charLimit}
      </p>
    </div>
  );
};

export const CounterTextArea: React.FC<ICounterTextAreaProps> = ({
  charLimit = 400,
  onChange,
  value,
  ...rest
}: ICounterTextAreaProps) => {
  const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (value === null) {
      onChange?.(e);
      return;
    }
    if (
      (typeof value === 'string' &&
        newValue.length <= charLimit &&
        newValue.length >= (value as string).length) ||
      newValue.length < (value as string)?.length
    ) {
      onChange?.(e);
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Textarea
        onChange={handleValueChange}
        className="m-0  h-32 placeholder:text-gray-300"
        {...rest}
        value={value}
      />
      <p className="self-end text-xs text-gray-400">
        {(typeof value === 'string' && value?.length) || 0}/{charLimit}
      </p>
    </div>
  );
};
