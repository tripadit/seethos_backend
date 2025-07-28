export const APPMIXPANELV1 = {
  herosection: {
    tryOutUnrealAi: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', { section: 'Hero Section', landingPage: 'v1' });
    },
  },
  trustInTechnology: {
    onClick: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', {
        section: 'TrustInTechnology',
        version: 'v1',
      });
    },
  },
  featureSection: {
    onClick: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', {
        section: 'Feature',
        version: 'v1',
      });
    },
  },
  datadriven: {
    onClick: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', {
        section: 'DataDriven',
        version: 'v1',
      });
    },
  },
  scaleOutReach: {
    onClick: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', {
        section: 'SacleOutReach',
        version: 'v1',
      });
    },
  },
  automatedB2BMeeting: {
    onClick: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', {
        section: 'AutomatedB2BMeeting',
        version: 'v1',
      });
    },
  },
  readyToElevate: {
    onClick: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', {
        section: 'ReadyToElevate',
        version: 'v1',
      });
    },
  },
};

export const APPMIXPANELV2 = {
  herosection: {
    tryOutUnrealAi: (mixpanel: any, email: string) => {
      mixpanel.track('Try Out Unreal AI - CTA with email', {
        section: 'Hero Section',
        landingPage: 'v2',
        email: email,
        redirecTo: 'signUp',
      });
    },
  },
  readyToAutomate: {
    onClick: (mixpanel: any) => {
      mixpanel.track('Try Out Unreal AI - CTA', {
        section: 'ReadyToAutomate',
        version: 'v2',
      });
    },
  },
  ourFeatures: {
    onClick: (mixpanel: any, title: string) => {
      mixpanel.track('Our Features Selection', {
        section: 'OurFeatures',
        version: 'v2',
        content: title,
      });
    },
  },
  hireAgesnt: {
    onClick: (mixpanel: any, title: string) => {
      mixpanel.track(title, {
        section: 'BusinessNeeds',
        version: 'v2',
        content: title,
      });
    },
  },
};
