import { useNavigate, useParams } from 'react-router-dom';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routes } from '@/routes/routes';

import AddAssistance from './assistant/routes/addAssistance';
import AddAssistantSuccess from './assistant/routes/addAssistantSuccess';
import BotAnalytics from './BotAnalytics';
import BotTraining from './BotTraining';
import LeadList from './LeadList';
import SessionList from './SessionList';

const AssistantDetails = () => {
  const params = useParams();
  const id: any = params.id;
  const tabs = params.tabType;

  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between w-full">
        <Tabs
          defaultValue={(tabs as string) || 'analytics'}
          className="w-full"
          value={(tabs as string) || 'analytics'}
          onValueChange={(value) =>
            navigate(routes.assistantDetail.replace(':id', id).replace(':tabType', value))
          }
        >
          <TabsList className="sticky  top-[-20px] h-[50px]  z-50 border-none bg-white   flex justify-start w-full">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="data-collection">Data</TabsTrigger>
            <TabsTrigger value="iframe">Landing Page</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="mt-0">
            <BotAnalytics botId={id as string} />
          </TabsContent>
          <TabsContent value="details" className="mt-0">
            <AddAssistance isEditMode assistantId={id ?? ''} />
          </TabsContent>
          <TabsContent value="sessions" className="mt-0">
            <SessionList id={id} />
          </TabsContent>
          <TabsContent value="data-collection" className="mt-0">
            <LeadList id={id} />
          </TabsContent>
          <TabsContent value="training" className="mt-0">
            <BotTraining botId={id as string} />
          </TabsContent>
          <TabsContent value="iframe" className="mt-0">
            <AddAssistantSuccess id={id} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AssistantDetails;
