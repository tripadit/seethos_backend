import { PrivacySetting } from '@/components/template';

const SettingPage = () => {
  return (
    // <Tabs
    //   defaultValue={(tabIndex as string) || 'privacy_setting'}
    //   onValueChange={(value) => navigate(routes.setting + `/?tabIndex=${value}`)}
    // >
    //   <TabsList>
    //     <TabsTrigger value={'privacy_setting'}>Privacy Setting</TabsTrigger>
    //     {/* <TabsTrigger value={'billing'}>Billing</TabsTrigger> */}
    //     {/* <TabsTrigger value={'deactivate'}>Deactivate</TabsTrigger> */}
    //   </TabsList>
    //   <TabsContent value={'privacy_setting'} className="py-10">
    //     <PrivacySetting />
    //   </TabsContent>
    //   <TabsContent value={'billing'} className="py-10">
    //     <BillingSetting />
    //   </TabsContent>
    //   <TabsContent value={'deactivate'} className="py-10">
    //     <DeactivatedSetting />
    //   </TabsContent>
    // </Tabs>
    <div className="flex flex-col max-w-[800px] gap-4">
      <PrivacySetting />
      {/*<DomainSettings />*/}
    </div>
  );
};

export default SettingPage;
