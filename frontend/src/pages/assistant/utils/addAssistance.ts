import { SupportTraningfileTypes } from '../constant/addAssistance';
import { IUploadFile } from '../types/addAssistance';

export const getRandomAvatars = (avatars: any[], count: number) => {
  // Copy the original array to avoid mutating it
  const copiedAvatars = [...avatars];

  // Randomize the array
  for (let i = copiedAvatars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedAvatars[i], copiedAvatars[j]] = [copiedAvatars[j], copiedAvatars[i]];
  }
  // Return the first 'count' elements
  return copiedAvatars.slice(0, count);
};
export const getTraningFileType = (mimeType: string) => {
  for (const [type, mimeTypes] of Object.entries(SupportTraningfileTypes)) {
    if (mimeTypes.includes(mimeType)) {
      return type;
    }
  }
  return mimeType;
};

export const tranformCreateAssistantFormToApi = (form: any): Record<any, any> => {
  const { company_logo, training_files, default_avatar, ...rest } = form;
  if (company_logo instanceof File) {
    rest.company_logo = company_logo;
  }
  if (rest.question) {
    rest.question = rest?.question
      .filter((item: any) => item.value !== '')
      .map((item: any) => item.value.trim())
      .join(',');
  }
  if (rest.greeting_tags) {
    rest.greeting_tags = rest?.greeting_tags.join(',');
  }
  if (training_files) {
    rest['files'] = training_files.map((file: IUploadFile) => file.id);
  }
  if (!default_avatar.startsWith('http') && !default_avatar.startsWith('https')) {
    rest.default_avatar = default_avatar;
  }
  return { ...rest };
};
