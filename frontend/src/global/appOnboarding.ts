import { driver } from 'driver.js';

export const appOnboardingDashboardDriver = driver({
  showProgress: true,
  nextBtnText: 'Next',
  prevBtnText: 'Previous',
  allowClose: false,
  steps: [
    {
      element: '#analytics',
      popover: {
        title: 'Dashboard Insights',
        description: `Here, you'll find an overview of your agent's performance. Monitor metrics like user interactions, conversion rates, and more.`,
      },
    },
    { element: '#bot-training', popover: { title: 'Title', description: 'Description' } },
  ],
});
