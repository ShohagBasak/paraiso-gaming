import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const CaptchaWidget = forwardRef(({ onVerify, onExpire }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const turnstileKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset: () => {
      try {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        } else if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } catch (e) {
        console.warn('Captcha reset error:', e);
      }
    }
  }));

  useEffect(() => {
    let isMounted = true;

    const initRecaptcha = () => {
      if (!window.grecaptcha || !containerRef.current) return;
      window.grecaptcha.ready(() => {
        if (!isMounted || !containerRef.current) return;
        try {
          if (widgetIdRef.current === null) {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: recaptchaKey,
              theme: 'dark',
              callback: (token) => {
                if (onVerify) onVerify(token);
              },
              'expired-callback': () => {
                if (onExpire) onExpire();
              }
            });
          }
        } catch {
          // Already rendered
        }
      });
    };

    const initTurnstile = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (!isMounted || !containerRef.current) return;
      try {
        if (widgetIdRef.current === null) {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: turnstileKey,
            theme: 'dark',
            callback: (token) => {
              if (onVerify) onVerify(token);
            },
            'expired-callback': () => {
              if (onExpire) onExpire();
            }
          });
        }
      } catch {
        // Already rendered
      }
    };

    if (recaptchaKey) {
      if (!window.grecaptcha) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = initRecaptcha;
        document.body.appendChild(script);
      } else {
        initRecaptcha();
      }
    } else if (turnstileKey) {
      if (!window.turnstile) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = initTurnstile;
        document.body.appendChild(script);
      } else {
        initTurnstile();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [recaptchaKey, turnstileKey, onVerify, onExpire]);

  return (
    <div className="flex flex-col items-center justify-center my-2 min-h-[78px] w-full overflow-hidden rounded-lg bg-slate-900/60 p-2 border border-slate-800">
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
});

export default CaptchaWidget;
