import { zodResolver } from '@hookform/resolvers/zod';
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { PageHeader } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { OneClickItem } from '@/pages/assistant/components/addAssistance/form/helper/oneClickItem';
import SelectAssistantDialog from '@/pages/assistant/components/selectAssistant/dialog';
import SelectedAssistant from '@/pages/assistant/components/selectAssistant/selectedAssistant';
import { routes } from '@/routes/routes';

import { useGenerateLeads, useGetLeadsByListId } from '../hooks/leadGeneration';
import { CountrySelector } from './CountrySelector';

export const SendAutomatedEmailFormSchema = z.object({
  prompt: z
    .string({ required_error: 'Please enter a email P=prompt' })
    .min(1, 'Please enter a email prompt'),
  subject: z.string({ required_error: 'Please enter a subject' }).min(1, 'Please enter a subject'),
  reply_email: z.string().email('Please enter a valid email address').optional(),
});

export type SendAutomatedEmailFormType = z.infer<typeof SendAutomatedEmailFormSchema>;

interface Props {
  // Define your component props here
}

const LeadGenerationFormSchema = z.object({
  profile_keywords: z.array(z.string()).nonempty('Please enter at least 1 keyword'),
  location: z
    .string({ required_error: 'Please enter a location' })
    .min(1, 'Please enter a location'),
  country: z
    .string({ required_error: 'Please enter a location' })
    .min(1, 'Please enter a location'),
  is_linkedIn: z.boolean({ required_error: 'Please enter a country code' }),
  name: z.string({ required_error: 'Please enter a name' }).min(1, 'Please enter a name'),
});

export type LeadGenerationFormSchemaType = z.infer<typeof LeadGenerationFormSchema>;

const CreateLead: React.FC<Props> = () => {
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();
  const assistant_id = params.get('assistant_id');

  const [selectAssistantOpen, setSelectAssistantOpen] = useState(false);

  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const [profileKeyword, setProfileKeyword] = React.useState<string>('');
  const [profileKeywords, setProfileKeywords] = React.useState<string[]>([]);

  const [leadListId, setLeadListId] = useState<number>();

  const generateLeads = useGenerateLeads();

  const { data } = useGetLeadsByListId(leadListId as number);

  const form = useForm<LeadGenerationFormSchemaType>({
    resolver: zodResolver(LeadGenerationFormSchema),
    defaultValues: {
      profile_keywords: [],
      location: '',
      country: '',
      is_linkedIn: false,
      name: '',
    },
  });

  useEffect(() => {
    if (data?.count || -1 > 0) navigate('/dashboard/lead-generation/' + leadListId);
  }, [data]);

  const handleGenerateLead = async () => {
    if (!assistant_id) {
      toast({
        title: 'Please select an assistant first',
        variant: 'destructive',
      });
      return;
    }
    const result = await form.trigger();
    const formValues = form.getValues();
    if (result) {
      const lead: any = await generateLeads.mutateAsync({
        ICP: formValues.profile_keywords,
        is_linkedIn: formValues.is_linkedIn,
        country: formValues.country,
        location: formValues.location,
        number_of_leads_requested: 1,
        name: formValues.name,
        chatbot: assistant_id,
      });
      setLeadListId(lead.id || 0);
    }
  };

  return (
    <div className="mb-20">
      <PageHeader title="Generate Lead"> </PageHeader>
      <Card className="px-6 py-4">
        <div className="text-[20px] leading-[24px] font-semibold pb-6">
          Find your perfect leads based on your personalized search
        </div>
        {/* <PageHeader title="Find your perfect leads based on your personalized search"> </PageHeader> */}
        <Form {...form}>
          <div className="grid grid-cols-2 items-start py-2 gap-6">
            <div className="flex flex-col gap-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex !flex-col">
                    <FormLabel className="text-sm text-gray-700">Lead List Name</FormLabel>
                    <div className="m-0 w-full flex flex-col  gap-1">
                      <Input
                        id="leadListName"
                        placeholder="Enter your desired lead list name"
                        className=" h-10"
                        {...field}
                        disabled={!!leadListId}
                      />
                      <FormMessage className="w-full" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="is_linkedIn"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex !flex-col">
                    <FormLabel className="text-sm text-gray-700">Target Socials</FormLabel>
                    <div className="flex gap-4 flex-wrap">
                      <div
                        className="flex gap-2 items-center h-10"
                        onClick={() => {
                          field.onChange(!field.value);
                        }}
                      >
                        <Checkbox
                          name="is_linkedIn"
                          value={field.name}
                          checked={field.value}
                          disabled={!!leadListId}
                        />
                        <label htmlFor="is_linkedIn">LinkedIn</label>
                      </div>
                      <div className="flex gap-2 items-center h-10">
                        <Checkbox disabled name="facebook" />
                        <label htmlFor="facebook">Facebook</label>
                      </div>
                      <div className="flex gap-2 items-center h-10">
                        <Checkbox disabled name="twitter" />
                        <label htmlFor="twitter">Twitter</label>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <SelectedAssistant
              onClickChange={() => {
                setSelectAssistantOpen(true);
              }}
            />

            <FormField
              control={form.control}
              name="profile_keywords"
              render={({ field }) => (
                <FormItem className="flex !flex-col w-full">
                  <FormLabel className="text-sm text-gray-700">
                    Ideal Client Profile Keywords
                  </FormLabel>
                  <div className="rounded-md w-full border border-input px-3 w-full items-center py-2 flex flex-wrap gap-2">
                    {profileKeywords.length > 0 && (
                      <>
                        {profileKeywords.map((item) => (
                          <OneClickItem
                            showRemove
                            key={item}
                            text={item}
                            isActive={false}
                            onClick={() => {}}
                            onRemove={() => {
                              if (!leadListId)
                                setProfileKeywords(profileKeywords.filter((el) => el !== item));
                            }}
                          />
                        ))}
                      </>
                    )}
                    <Input
                      placeholder="Type and press enter to add a keyword"
                      id="idealClientProfileKeywords"
                      name="idealClientProfileKeywords"
                      className="mt-0 border-0 h-7 flex-1 p-0 min-w-[100px]"
                      value={profileKeyword}
                      disabled={!!leadListId}
                      onChange={(e) => {
                        setProfileKeyword(e.target.value);
                      }}
                      onBlur={() => {
                        if (profileKeyword.length > 0) {
                          setProfileKeyword('');
                          setProfileKeywords([...new Set([...profileKeywords, profileKeyword])]);
                          field.onChange([...new Set([...field.value, profileKeyword])]);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setProfileKeyword('');
                          setProfileKeywords([...new Set([...profileKeywords, profileKeyword])]);
                          field.onChange([...new Set([...field.value, profileKeyword])]);
                        }
                      }}
                    />
                  </div>
                  <FormMessage className="w-full" />
                </FormItem>
              )}
            />
            <div className="flex items-start gap-4">
              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex !flex-col">
                    <FormLabel className="text-sm text-gray-700">Country</FormLabel>
                    <div className="m-0 md:max-w-md w-full flex flex-col col-span-4 gap-1">
                      <FormControl>
                        <CountrySelector
                          disabled={!!leadListId}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="w-full" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="location"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex !flex-col">
                    <FormLabel className="text-sm text-gray-700">City</FormLabel>
                    <div className="m-0 md:max-w-md w-full flex flex-col col-span-4 gap-1">
                      <Input
                        id="location"
                        placeholder="Enter your desired business location"
                        className="col-span-4 h-11"
                        {...field}
                        disabled={!!leadListId}
                      />
                      <FormMessage className="w-full" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {!leadListId && (
              <>
                <div />
                <div className="w-full flex justify-start">
                  <Button
                    isLoading={generateLeads.isLoading}
                    className="capitalize bg-purple-500 text-white gap-3"
                    onClick={() =>
                      checkAccount(() => {
                        handleGenerateLead();
                      })
                    }
                  >
                    <SearchIcon /> <p>Search Leads</p>
                  </Button>
                </div>
              </>
            )}
          </div>
        </Form>

        {!!leadListId && (
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 300 150">
              <path
                fill="none"
                stroke="#DC3450"
                stroke-width="15"
                stroke-linecap="round"
                stroke-dasharray="300 385"
                stroke-dashoffset="0"
                d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  calcMode="spline"
                  dur="2"
                  values="685;-685"
                  keySplines="0 0 1 1"
                  repeatCount="indefinite"
                ></animate>
              </path>
            </svg>
            <div className="mt-2">Generating Leads</div>
            <div className="text-sm text-gray-600">This may take a while. Please wait.</div>
          </div>
        )}
      </Card>
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
      {selectAssistantOpen && (
        <SelectAssistantDialog
          title="Assistant selection for leads generation"
          description="Select an assistant for this leads to get started."
          onSelectAssistant={(id: number) => {
            setParams({ assistant_id: id.toString() }, { replace: true });
            setSelectAssistantOpen(false);
          }}
          onCreateAssistant={() => {
            navigate(routes.addAssistance + `?callbackUrl=${routes.createLead}`);
          }}
          onClose={() => {
            setSelectAssistantOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default CreateLead;
