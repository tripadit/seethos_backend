import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { ArrowBlockLeft } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { ASSISTANCEAVATAR, ASSISTANCENAME } from '@/pages/assistant/constant/addAssistance';
import {
  useGenerateAssistantNames,
  useGetAssistantAvatars,
} from '@/pages/assistant/hooks/addAssistance';
import {
  AssistanceAvatarFormSchemaType,
  BusinessDetailsSchemaType,
} from '@/pages/assistant/routes/addAssistance';
import { IAssistanceAvatarList } from '@/pages/assistant/types/addAssistance';
import { getRandomAvatars } from '@/pages/assistant/utils/addAssistance';
interface IAssistanceAvatarProps {
  handleNextBusinessDetails: (
    tab: '1' | '2' | null,
    isChangeStep?: boolean,
    isBack?: boolean,
  ) => void;
  form: UseFormReturn<AssistanceAvatarFormSchemaType>;
  businessDetailsForm: UseFormReturn<BusinessDetailsSchemaType>;
  avatar?: string;
  isEidtMode?: boolean;
}
export const AssistanceAvatar = ({
  handleNextBusinessDetails,
  form,
  avatar: avatarImage,
  businessDetailsForm,
  isEidtMode,
}: IAssistanceAvatarProps) => {
  const [isGenerateAvatar, setIsGenerateAvatar] = React.useState<boolean>(true);
  const [isGenerateAvatarName, setIsGenerateAvatarName] = React.useState<boolean>(true);
  const [avatar, setAvatar] = React.useState<IAssistanceAvatarList[]>([]);
  const [avatarName, setAvatarName] = React.useState<string[]>(getRandomAvatars(ASSISTANCENAME, 4));

  const getAssistantNames = useGenerateAssistantNames(undefined, () => {
    generateAvatarName();
  });

  const getAssistantAvatars = useGetAssistantAvatars();

  React.useEffect(() => {
    if (isGenerateAvatar) {
      handleGenerateAvatar();
      generateAvatarName();
      setTimeout(() => {
        setIsGenerateAvatar(false);
        setIsGenerateAvatarName(false);
      }, 1000);
    }
  }, []);

  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const generateAvatar = () => {
    const defaultAvatar = form.watch('default_avatar');
    const avatar = ASSISTANCEAVATAR.find((el) => el.id === defaultAvatar);

    if (avatar) {
      const avatarList = [...new Set([avatar, ...getRandomAvatars(ASSISTANCEAVATAR, 3)])];
      setAvatar(avatarList);
    } else {
      setAvatar(getRandomAvatars(ASSISTANCEAVATAR, 4));
    }
  };
  const generateAvatarName = () => {
    const defaultName = form.watch('name');
    if (defaultName && isEidtMode) {
      const nameList = [...new Set([defaultName, ...getRandomAvatars(ASSISTANCENAME, 5)])];
      setAvatarName(nameList);
    } else {
      setAvatarName([...getRandomAvatars(ASSISTANCENAME, 4)]);
    }
  };

  const handleGenerateAvatar = async () => {
    setIsGenerateAvatar(true);
    const assistantAvatars = await getAssistantAvatars.mutateAsync({ page: currentPage });
    if (assistantAvatars?.data) {
      const avatarList = [...new Set([...assistantAvatars.data])];
      setAvatar(avatarList);
      setCurrentPage((prev) => {
        const totalPages = Math.ceil(assistantAvatars.count / 5) + 1;
        let nextPage = (prev + 1) % (totalPages === 0 ? 1 : totalPages);
        if (nextPage === 0) {
          nextPage = 1;
        }
        return nextPage;
      });
    } else {
      generateAvatar();
    }
    setIsGenerateAvatar(false);
  };

  const handleGenerateAvatarName = async () => {
    const description = businessDetailsForm.watch('company_description');
    const businessName = businessDetailsForm.watch('company_name');
    const location = businessDetailsForm.watch('location');
    setIsGenerateAvatarName(true);
    const names = await getAssistantNames.mutateAsync({
      description,
      business_name: businessName,
      location: location,
    });
    if (names?.names) setAvatarName(names.names);

    setIsGenerateAvatarName(false);
  };

  return (
    <div>
      <Form {...form}>
        <div className="grid gap-4 py-2 col-span-2">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="default_avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Assistant Avatar</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-5">
                  {isGenerateAvatar && (
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-1000 font-normal text-base">
                        Generating unique avatars for your assistant.
                      </p>
                      <Skeleton className="w-full h-20 bg-gray-300 rounded-lg" />
                    </div>
                  )}
                  {!isGenerateAvatar && (
                    <>
                      <p className="text-gray-1000 font-normal text-base">
                        Select an AI avatar for your Assistant below or generate more avatars.
                      </p>

                      <RadioGroup
                        className="m-0 w-full  flex flex-wrap gap-5"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        {avatarImage && (
                          <div className="flex space-x-2">
                            <RadioGroupItem value={avatarImage} />
                            <FormLabel htmlFor={avatarImage}>
                              <img
                                src={avatarImage}
                                className=" object-cover h-[60px] w-[60px] rounded-full"
                              />
                            </FormLabel>
                          </div>
                        )}
                        {avatar.map((el) => {
                          return (
                            <div className="flex space-x-2">
                              <RadioGroupItem value={el.id} id={el.id} />
                              <FormLabel htmlFor={el.id}>
                                <img
                                  src={el.avatar}
                                  className=" object-cover h-[60px] w-[60px] rounded-full"
                                />
                              </FormLabel>
                            </div>
                          );
                        })}
                      </RadioGroup>
                      <FormMessage className="w-full" />
                      <Button
                        variant={'purple'}
                        className="w-fit"
                        onClick={() => {
                          handleGenerateAvatar();
                        }}
                      >
                        Generate more avatars{' '}
                      </Button>
                    </>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Assistant Name</FormLabel>
                <div className="m-0 md:max-w-md  w-full flex flex-col gap-5">
                  {isGenerateAvatarName && (
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-1000 font-normal text-base">
                        Generating unique names for your assistant.
                      </p>
                      <Skeleton className="w-full h-20 bg-gray-300 rounded-lg" />
                    </div>
                  )}
                  {!isGenerateAvatarName && (
                    <>
                      <p className="text-gray-1000 font-normal text-base">
                        Select an AI Assistant name
                      </p>

                      <RadioGroup
                        className="m-0 w-full  flex flex-wrap gap-5"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        {avatarName.map((el) => {
                          return (
                            <div className="flex space-x-2 items-center">
                              <RadioGroupItem value={el} id={el} />
                              <FormLabel htmlFor={el} className="font-normal text-base">
                                {el}
                              </FormLabel>
                            </div>
                          );
                        })}
                      </RadioGroup>
                      <div className="flex flex-col gap-1">
                        <p className="text-[#4B5563] font-normal text-sm">or make your own</p>
                        <Input
                          id="name"
                          placeholder="Enter your company name"
                          className="col-span-4"
                          {...field}
                        />
                        <FormMessage className="w-full" />
                      </div>
                      <Button
                        variant={'purple'}
                        className="w-fit"
                        onClick={() => handleGenerateAvatarName()}
                      >
                        Generate more names
                      </Button>
                    </>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormItem>
            <div></div>
            <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
              <div className="flex items-center gap-3 ">
                <Button
                  type="submit"
                  variant="outline"
                  onClick={() => handleNextBusinessDetails('1', false, true)}
                >
                  <ArrowBlockLeft />
                  Back
                </Button>
                <Button
                  disabled={isGenerateAvatar || isGenerateAvatarName}
                  type="submit"
                  variant="purple"
                  icon={<ArrowBlockLeft className="-rotate-180" />}
                  onClick={() => handleNextBusinessDetails('1', true)}
                >
                  Next
                </Button>
              </div>
            </div>
          </FormItem>
        </div>
      </Form>
    </div>
  );
};
