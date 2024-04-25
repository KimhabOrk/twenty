import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { isCaptchaLoadedState } from '@/auth/states/isCaptchaLoadedState';
import { captchaProviderState } from '@/client-config/states/captchaProviderState';
import { getCaptchaUrlByProvider } from '~/utils/captcha';

export const useInsertCaptchaScript = () => {
  const captchaProvider = useRecoilValue(captchaProviderState);
  const [isCaptchaLoaded, setIsCaptchaLoaded] =
    useRecoilState(isCaptchaLoadedState);

  useEffect(() => {
    if (!captchaProvider?.provider || !captchaProvider.siteKey) {
      return;
    }

    const scriptUrl = getCaptchaUrlByProvider(
      captchaProvider.provider,
      captchaProvider.siteKey,
    );
    if (!scriptUrl) {
      return;
    }

    let scriptElement: HTMLScriptElement | null = document.querySelector(
      `script[src="${scriptUrl}"]`,
    );
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = () => {
        setIsCaptchaLoaded(true);
      };
      document.body.appendChild(scriptElement);
    }
  }, [captchaProvider?.provider, captchaProvider?.siteKey, setIsCaptchaLoaded]);

  return isCaptchaLoaded;
};
