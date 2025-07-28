import http from '@/utils/http';

const URL = {
  emailNotification: '/email-campaign/get_notifications/',
};

export interface INotificationResponse {
  unread_emails: number;
}
export const getEmailNotifications = async (): Promise<INotificationResponse> => {
  return http().get(URL.emailNotification);
};
