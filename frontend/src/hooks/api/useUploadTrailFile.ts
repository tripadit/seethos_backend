import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';
export const fileTypes = {
  word: [
    'application/vnd.ms-word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/docx',
    'application/msword',
  ],
  excel: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  pdf: ['application/pdf'],
};

const getFileType = (mimeType: string) => {
  for (const [type, mimeTypes] of Object.entries(fileTypes)) {
    if (mimeTypes.includes(mimeType)) {
      return type;
    }
  }
  return mimeType;
};

export function useUploadFile() {
  const { toast } = useToast();

  const uploadFile = (postData: File) => {
    const formData = new FormData();
    formData.append('file', postData);
    formData.append('name', postData.name);
    formData.append('type', getFileType(postData.type));
    formData.append('size', postData.size.toString());
    const updatedEndpoints = endpoints.file;
    return http('multipart').post(updatedEndpoints, formData);
  };

  return useMutation(uploadFile, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while uploading a file.'}`,
        description: 'Please try again later.',
      });
    },
  });
}
