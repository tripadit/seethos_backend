import { z } from 'zod';

export const signInSchema = z.object({
  otp: z.string().min(6, 'Please enter the correct OTP.'),
});
