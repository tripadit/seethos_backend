import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IPasswordInputProps extends InputProps {
  inputLeftElem?: any;
  inputRightElem?: any;
}

export const PasswordInput = ({
  inputRightElem: RIcon,
  inputLeftElem: LIcon,
  type,
  ...props
}: IPasswordInputProps) => {
  return (
    <div
      className={cn(
        'flex h-10 items-center pr-3 py-2 gap-2 border border-input bg-background rounded-md',
      )}
    >
      {LIcon && LIcon}
      <Input
        className="h-10 rounded-md border-x-0 border-input bg-background"
        type={type}
        {...props}
      />
      {RIcon && RIcon}
    </div>
  );
};
