import { useEffect } from 'react';

import AutonomousAgents from '@/components/template/Products/autonomous-agents';

const AutonomousAgentsPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <>
      <AutonomousAgents />
    </>
  );
};

export default AutonomousAgentsPage;
