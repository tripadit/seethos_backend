import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/molecules/NavBar';
import { FooterSection } from '@/components/section';
import { AppContextProvider } from '@/components/section/ChatbotSection/chatbot/context/appContextProvider';

export const LandingLayout = () => {
  return (
    <div className="relative overflow-hidden ">
      <Navbar />
      <AppContextProvider>
        <Outlet />
      </AppContextProvider>
      <FooterSection />
    </div>
  );
};
