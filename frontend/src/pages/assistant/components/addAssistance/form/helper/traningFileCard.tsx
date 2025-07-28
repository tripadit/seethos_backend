import { DownloadIcon, FileIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { convertBytes } from '@/lib/utils';
import { useDeleteTraningFile } from '@/pages/assistant/hooks/addAssistance';
import { IUploadFile } from '@/pages/assistant/types/addAssistance';
interface ITraningFileCardProps {
  file: IUploadFile;
  onSuccess: () => void;
}
export const TraningFileCard = ({ file, onSuccess }: ITraningFileCardProps) => {
  const deleteTraningFile = useDeleteTraningFile(onSuccess);
  return (
    <Card className="p-4 flex  flex-row items-center gap-2">
      <FileIcon />
      <div className="flex items-end justify-between flex-1">
        <div className="max-w-[250px] w-full">
          <h4 className="line-clamp-1">{file.name || `File ${file.id}`}</h4>
          <p>{convertBytes(parseInt(file.size))}</p>
        </div>
      </div>
      <a href={file?.file} target="_blank" rel="noopener noreferrer" className="text-xs">
        <Button
          disabled={deleteTraningFile.isLoading}
          variant={'ghost'}
          icon={<DownloadIcon size={18} />}
        ></Button>
      </a>
      <Button
        isLoading={deleteTraningFile.isLoading}
        variant={'ghost'}
        icon={<Trash2Icon size={18} />}
        onClick={async () => {
          deleteTraningFile.mutate(file.id);
        }}
      ></Button>
    </Card>
  );
};
