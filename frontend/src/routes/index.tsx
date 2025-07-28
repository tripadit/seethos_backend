import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Layout, My404Component } from '@/components/molecules';
import { LandingLayout } from '@/components/template/LandingLayout';
import LazyImport from '@/utils/lazyLoading';

import { PrivateRoutes, PublicRoutes } from './AuthGuard';
import { routes } from './routes';

export const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: routes.signIn,
        element: LazyImport(() => import('@/pages/auth/SignIn')),
      },

      {
        path: routes.signnUp,
        element: LazyImport(() => import('@/pages/auth/SignUp')),
      },
      {
        path: routes.forgetPassword,
        element: LazyImport(() => import('@/pages/auth/ForgetPassword')),
      },
      {
        path: routes.passwordReset,
        element: LazyImport(() => import('@/pages/auth/PasswordReset')),
      },
      {
        path: routes.verifyCode,
        element: LazyImport(() => import('@/pages/auth/CodeVerification')),
      },
      {
        path: routes.verificationSuccess,
        element: LazyImport(() => import('@/pages/auth/VerificationSuccess')),
      },
      {
        element: <LandingLayout />,
        children: [
          {
            path: routes.home,
            element: <Navigate to={routes.signIn} replace />,
          },
          {
            path: routes.homev2,
            element: LazyImport(() => import('@/pages/landing/home/routes/HomePage')),
          },
          {
            path: routes.cookiePolicy,
            element: LazyImport(() => import('@/pages/landing/CookiePage')),
          },
          {
            path: routes.privacyPolicy,
            element: LazyImport(() => import('@/pages/landing/PrivacyPolicyPage')),
          },
          {
            path: routes.termsOfService,
            element: LazyImport(() => import('@/pages/landing/TermsOfServicePage')),
          },
          {
            path: routes.blog,
            element: LazyImport(() => import('@/pages/landing/BlogPage')),
          },
          {
            path: routes.blogDetail,
            element: LazyImport(() => import('@/pages/landing/BlogDetailPage')),
          },
          {
            path: routes.pricing,
            element: LazyImport(() => import('@/pages/landing/Pricing')),
          },
          {
            path: routes.products.restaurants,
            element: LazyImport(() => import('@/pages/landing/products/Restaurants')),
          },
          {
            path: routes.products.industry4,
            element: LazyImport(() => import('@/pages/landing/products/Industry')),
          },
          {
            path: routes.products.unrealAiMarketing,
            element: LazyImport(() => import('@/pages/landing/products/AutomatedMarketing')),
          },
          {
            path: routes.products.autonomousAgents,
            element: LazyImport(() => import('@/pages/landing/products/AutonomousAgents')),
          },
          {
            path: routes.aboutUs,
            element: LazyImport(() => import('@/pages/landing/AboutUs')),
          },
        ],
      },
    ],
  },
  {
    path: routes.verify,
    element: LazyImport(() => import('@/pages/auth/AccountVerification')),
  },
  {
    path: routes.payment,
    element: LazyImport(() => import('@/pages/Payment')),
  },
  {
    path: routes.unsubscribe,
    element: LazyImport(() => import('@/pages/unsubscribe/components/index')),
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: routes.dashboard,
        element: <Layout />,
        children: [
          {
            index: true,
            element: LazyImport(() => import('@/pages/assistant/routes/dashboard')),
          },
          {
            path: routes.assistantDetail,
            element: LazyImport(() => import('@/pages/AssistantDetails')),
          },
          {
            path: routes.assistantDetailById,
            element: LazyImport(() => import('@/pages/AssistantDetails')),
          },
          {
            path: routes.addAssistance,
            element: LazyImport(() => import('@/pages/assistant/routes/addAssistance')),
          },
          {
            path: routes.iframeList,
            element: LazyImport(() => import('@/pages/IframeList')),
          },
          {
            path: routes.iframeDetail,
            element: LazyImport(() => import('@/pages/Integration')),
          },
          {
            path: routes.sessionList,
            element: LazyImport(() => import('@/pages/SessionList')),
          },
          {
            path: routes.sessionDetail,
            element: LazyImport(() => import('@/pages/SessionDetail')),
          },
          {
            path: routes.setting,
            element: LazyImport(() => import('@/pages/SettingPage')),
          },
          {
            path: routes.leadList,
            element: LazyImport(() => import('@/pages/LeadList')),
          },
          {
            path: routes.leadsList,
            element: LazyImport(() => import('@/pages/leadGeneration/components/LeadsList')),
          },
          {
            path: routes.leadGeneration,
            element: LazyImport(() => import('@/pages/leadGeneration/components/index')),
          },
          {
            path: routes.leadListDetails,
            element: LazyImport(
              () => import('@/pages/leadGeneration/components/LeadListDetails/LeadListDetails'),
            ),
          },
          {
            path: routes.leadDetails,
            element: LazyImport(
              () => import('@/pages/leadGeneration/components/LeadgenLeadDetails'),
            ),
          },
          {
            path: routes.emailCampaignLead,
            element: LazyImport(
              () => import('@/pages/leadGeneration/components/EmailCampaignLead'),
            ),
          },
          {
            path: routes.createLead,
            element: LazyImport(() => import('@/pages/leadGeneration/components/CreateLead')),
          },
          {
            path: routes.training,
            element: LazyImport(() => import('@/pages/TrainingPage')),
          },
          {
            path: routes.analytics,
            element: LazyImport(() => import('@/pages/AnalyticsPage')),
          },
          {
            path: routes.profile,
            element: LazyImport(() => import('@/pages/ProfilePage')),
          },
          {
            path: routes.conversations,
            element: LazyImport(() => import('@/pages/Conversations')),
          },
          {
            path: routes.support,
            element: LazyImport(() => import('@/pages/Support')),
          },
          {
            path: routes.marketingAnalytics,
            element: LazyImport(() => import('@/pages/analytics/routes/marketingAnalytics')),
          },
          {
            path: routes.campaignManagement,
            element: LazyImport(() => import('@/pages/campaignManagement/routes/campaingnList')),
          },
          {
            path: routes.campaignCreate,
            element: LazyImport(() => import('@/pages/campaignManagement/routes/createCampaign')),
          },
          {
            path: routes.createSequencecampaign,
            element: LazyImport(
              () => import('@/pages/campaignManagement/routes/createSequenceCampaign'),
            ),
          },
          {
            path: routes.campaignReview,
            element: LazyImport(() => import('@/pages/campaignManagement/routes/reviewCampaign')),
          },
          {
            path: routes.reviewSequenceCampaign,
            element: LazyImport(
              () => import('@/pages/campaignManagement/routes/reviewSequenceCampaign'),
            ),
          },
          {
            path: routes.campaignDetail,
            element: LazyImport(() => import('@/pages/campaignManagement/routes/viewCampaign')),
          },
          {
            path: routes.sequenceCampaignDetail,
            element: LazyImport(
              () => import('@/pages/campaignManagement/routes/viewSequenceCampaign'),
            ),
          },
          {
            path: routes.addAssistantSuccess,
            element: LazyImport(() => import('@/pages/assistant/routes/addAssistantSuccess')),
          },
          {
            path: routes.ghl,
            element: LazyImport(() => import('@/pages/ghl/routes')),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <My404Component />,
  },
]);
