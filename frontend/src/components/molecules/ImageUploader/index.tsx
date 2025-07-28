import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { ExportIcon } from '@/assets/icons';
import { cn } from '@/lib/utils';

export const SingleImageUpload = ({
  title = 'Upload Image',
  className = '',
  onImageUpload = () => {},
  isLoading,
  fileUrl,
  children,
  multiple = false,
  accept = { 'image/*': [] },
  titleClassName,
  disabled,
}: {
  title?: string | React.ReactNode;
  className?: string;
  onImageUpload?: (file: File[]) => void;
  isCrop?: boolean;
  isLoading?: boolean;
  fileUrl?: string;
  children?: React.ReactNode;
  multiple?: boolean;
  accept?: any;
  titleClassName?: string;
  disabled?: boolean;
}) => {
  const onDrop = async (acceptedFiles: any[]) => {
    const files: File[] = Object.values(acceptedFiles);
    onImageUpload(files);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: multiple,
    onDrop,
    accept: accept,
    disabled: isLoading || disabled,
  });

  return (
    <div
      className={cn(
        'w-max cursor-pointer h-[410px] px-6 border-dashed rounded-lg gap-2 text-white/50 flex flex-row justify-center items-center',
        { 'bg-gray-200': isLoading },
        className,
      )}
      {...getRootProps()}
    >
      {!isLoading && <input {...getInputProps()} />}

      {!typeof children === undefined ? (
        children
      ) : (
        <>
          {fileUrl ? (
            <img src={fileUrl} alt="image" className="rounded-md object-fill h-[410px]" />
          ) : (
            <>
              <div className=" bg-gray-50 p-2 rounded-full">
                <div className="bg-gray-200 p-0.5 rounded-full">
                  <ExportIcon />
                </div>
              </div>
              {!isLoading && (
                <p className={clsx('text-gray-500 text-[10px] whitespace-nowrap', titleClassName)}>
                  {title || null}
                </p>
              )}
              {isLoading && <Loader2 className="text-gray-500 animate-spin" />}
            </>
          )}
        </>
      )}
    </div>
  );
};
