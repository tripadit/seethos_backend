import React, { memo, useLayoutEffect, useRef } from 'react';

import { Input } from '@/components/ui/input';
import { usePrevious } from '@/hooks/usePrevious';

export interface SingleOTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  focus?: boolean;
}

export function SingleOTPInputComponent(props: SingleOTPInputProps) {
  const { focus, autoFocus, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocus = usePrevious(!!focus);
  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus && autoFocus) {
        inputRef.current.focus();
      }
      if (focus && autoFocus && focus !== prevFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [autoFocus, focus, prevFocus]);

  return (
    <Input
      ref={inputRef}
      {...rest}
      className="w-10  h-10 lg:w-14 text-[#7D7D7D] font-medium text:xl lg:text-3xl lg:h-14 text-center"
    />
  );
}

const SingleOTPInput = memo(SingleOTPInputComponent);
export default SingleOTPInput;
