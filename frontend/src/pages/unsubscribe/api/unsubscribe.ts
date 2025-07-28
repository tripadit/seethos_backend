import http from '@/utils/http';

export function unsubscribeFromCampaign(req: { email?: string; source?: string }) {
  return http().get('/unsubscribe/email/?email=' + req.email + '&source=' + req.source);
}
