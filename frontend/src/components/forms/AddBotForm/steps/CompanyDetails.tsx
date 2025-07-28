import { BotBlueImage, BotGreenImage, BoyAvatar, GirlAvatar } from '@/assets/images';
import { SingleImageUpload } from '@/components/molecules';
import Required from '@/components/molecules/Required';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

interface ICompanyDetails {
  form: any;
  botDetail: any;
  mode?: string | null;
  companyLogo?: any;
  setCompanyLogo?: any;
  file?: any;
  setFile?: any;
}

export const CompanyDetails = ({
  form,
  botDetail,
  mode,
  companyLogo,
  setCompanyLogo,
  file,
  setFile,
}: ICompanyDetails) => {
  const DefaultBotData = [
    {
      id: '4',
      image: BotBlueImage,
    },
    {
      id: '5',
      image: BotGreenImage,
    },
    {
      id: '6',
      image: BoyAvatar,
    },
    {
      id: '7',
      image: GirlAvatar,
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Company Name */}
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem className="grid grid-cols-[170px_1fr]">
            <FormLabel className="min-w-170">
              Company Name
              <Required />
            </FormLabel>
            <div className=" w-full">
              <FormControl>
                <Input placeholder="Enter company name" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Company logo */}
      <FormField
        control={form.control}
        name="company_logo"
        render={({ field }) => (
          <FormItem className="grid grid-cols-[170px_1fr]">
            <FormLabel className="min-w-170">
              Company Logo
              <Required />
            </FormLabel>
            <div className="flex flex-col gap-4">
              <FormControl>
                <div className="flex gap-2">
                  <div className="flex space-x-2">
                    <FormLabel htmlFor="custom-icon">
                      <div className="flex flex-col gap-1">
                        <SingleImageUpload
                          title="Choose File"
                          onImageUpload={(file) => {
                            setCompanyLogo(file[0]);
                            form.clearErrors('company_logo');
                          }}
                          className="h-[50px] bg-white border border-neutral-300"
                        ></SingleImageUpload>
                        <div className="text-sm font-medium text-gray-500 flex gap-2 items-center">
                          <p>Max 3 mb</p>
                        </div>
                      </div>
                    </FormLabel>
                  </div>
                  {((companyLogo &&
                    typeof companyLogo !== 'string' &&
                    URL.createObjectURL(companyLogo)) ||
                    field.value) && (
                    <img
                      src={
                        (companyLogo &&
                          typeof companyLogo !== 'string' &&
                          URL.createObjectURL(companyLogo)) ||
                        field.value
                      }
                      className="w-12 h-12"
                    />
                  )}
                </div>
              </FormControl>
              {form.formState.errors!.company_logo?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors!.company_logo?.message?.toString()}
                </p>
              )}
            </div>
          </FormItem>
        )}
      />

      {/* Chatbot Avatar */}
      <FormField
        control={form.control}
        name="avatar"
        render={({ field }) => (
          <FormItem className="grid grid-cols-[170px_1fr]">
            <FormLabel className="min-w-170">
              Agent Avatar
              <Required />
            </FormLabel>
            <div className="flex flex-col gap-4">
              <p className="text-gray-500 text-base font-normal">
                Select avatar for agent or upload your custom
              </p>
              {/* <FormControl>
                <>
                  <div>
                    <SingleImageUpload
                      title="Choose File"
                      onImageUpload={(file) => {
                        setFile(file[0]);
                        form.clearErrors('avatar');
                      }}
                      className="h-[50px] bg-white border border-neutral-300"
                    ></SingleImageUpload>
                    {file && <p className="truncate max-w-[130px] text-gray-600">{file?.name}</p>}
                  </div>
                  {mode === 'edit' && botDetail && field.value === botDetail.avatar && (
                    <img src={field.value} className="w-12 h-12" />
                  )}
                </>
              </FormControl> */}
              <FormControl>
                <RadioGroup
                  className="m-0 mt-2 md:max-w-sm w-full  flex flex-wrap gap-5"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  {/** V2 */}
                  {/* <div className="flex space-x-2">
                              <RadioGroupItem value="bot-blue" id="bot-one" />
                              <FormLabel htmlFor="bot-one">
                                <BotBlueIcon />
                              </FormLabel>
                            </div>
                            <div className="flex space-x-2">
                              <RadioGroupItem value="bot-green" id="bot-two" />
                              <FormLabel htmlFor="bot-two">
                                <BotGreenIcon />
                              </FormLabel>
                            </div> */}
                  {mode !== 'edit' &&
                    DefaultBotData.map((el) => {
                      return (
                        <div className="flex space-x-2">
                          <RadioGroupItem value={el.id} id={el.id} />
                          <FormLabel htmlFor={el.id}>
                            <div className="flex flex-col gap-1">
                              <div className="bg-white h-[71px] w-[95px] border-dashed">
                                <img src={el.image} className=" object-cover  w-20 h-20" />
                              </div>
                            </div>
                          </FormLabel>
                        </div>
                      );
                    })}

                  {mode === 'edit' && botDetail?.avatar && (
                    <div className="flex space-x-2">
                      <RadioGroupItem value={botDetail.avatar} id={botDetail.avatar} />
                      <FormLabel htmlFor={botDetail.avatar}>
                        <div className="flex flex-col gap-1">
                          <div className="bg-white h-[71px] w-[95px] border-dashed">
                            <img
                              src={botDetail.avatar}
                              className="w-20 h-20"
                              onClick={() => setFile(undefined)}
                            />
                          </div>
                        </div>
                      </FormLabel>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <RadioGroupItem value="custom-icon" id="custom-icon" />
                    <FormLabel htmlFor="custom-icon">
                      <div className="flex  items-center gap-3">
                        <SingleImageUpload
                          title="Upload File"
                          onImageUpload={(file) => {
                            setFile(file[0]);
                            form.clearErrors('avatar');
                          }}
                          className="h-[71px] w-[95px] bg-white border flex-col border-neutral-300"
                        ></SingleImageUpload>
                        {file && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            onLoad={() => URL.revokeObjectURL(file)}
                            className="w-20 h-20 rounded-full"
                          />
                        )}
                      </div>
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              {form.formState.errors!.avatar?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors!.avatar?.message?.toString()}
                </p>
              )}
            </div>
          </FormItem>
        )}
      />

      {/* Agent Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="grid grid-cols-[170px_1fr]">
            <FormLabel className="min-w-170">
              Assistant Name
              <Required />
            </FormLabel>
            <div className="m-0 md:max-w-sm w-full">
              <FormControl>
                <Input placeholder="Enter assistant name" {...field} />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Bot Status */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="justify-start">
            <FormLabel className="min-w-170">Status</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <p className="text-gray-700 text-base font-medium">Active</p>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rotate-180"
                />
                <p className="text-gray-700 text-base font-medium">Inactive</p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
