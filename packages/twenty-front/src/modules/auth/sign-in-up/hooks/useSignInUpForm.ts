import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRecoilValue } from 'recoil';
import { z } from 'zod';

import { PASSWORD_REGEX } from '@/auth/utils/passwordRegex';
import { isSignInPrefilledState } from '@/client-config/states/isSignInPrefilledState';

const validationSchema = z
  .object({
    exist: z.boolean(),
    email: z.string().trim().email('O email deve ser válido'),
    password: z
      .string()
      .regex(PASSWORD_REGEX, 'A senha deve conter pelo menos 8 caracteres'),
    captchaToken: z.string().default(''),
  })
  .required();

export type Form = z.infer<typeof validationSchema>;
export const useSignInUpForm = () => {
  const isSignInPrefilled = useRecoilValue(isSignInPrefilledState);
  const form = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      exist: false,
    },
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (isSignInPrefilled === true) {
      form.setValue('email', 'tim@apple.dev');
      form.setValue('password', 'Applecar2025');
    }
  }, [form, isSignInPrefilled]);
  return { form: form };
};
