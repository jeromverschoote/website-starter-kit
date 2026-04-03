'use client';

import { useEffect, useState } from 'react';

// eslint-disable-next-line import/no-named-as-default
import posthog from 'posthog-js';

import { Button } from '@repo/ui/button';
import Icon from '@repo/ui/icon';

import { TDictionary } from 'config/i18n';

import { toClassName } from 'helpers/format';

import { styles } from '.';

type TProps = {
  dictionary: TDictionary;
};

export const cookieConsentGiven = (): 'yes' | 'no' | 'undecided' => {
  const stored = localStorage.getItem('cookie_consent');
  if (stored === 'yes' || stored === 'no') return stored;
  return 'undecided';
};

const CookieConsent = (props: TProps) => {
  const { dictionary } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const [consentGiven, setConsentGiven] = useState('');

  const handleClickAccept = () => {
    setIsOpen(false);

    localStorage.setItem('cookie_consent', 'yes');
    setConsentGiven('yes');

    setTimeout(() => {
      setHide(true);
    }, 700);

    posthog.opt_in_capturing();
  };

  const handleClickDecline = () => {
    setIsOpen(false);

    localStorage.setItem('cookie_consent', 'no');
    setConsentGiven('no');

    setTimeout(() => {
      setHide(true);
    }, 700);

    posthog.opt_out_capturing();
  };

  useEffect(() => {
    setConsentGiven(cookieConsentGiven());
  }, []);

  useEffect(() => {
    if (consentGiven !== '') {
      posthog.set_config({
        persistence: consentGiven === 'yes' ? 'localStorage+cookie' : 'memory',
      });
    }
  }, [consentGiven]);

  useEffect(() => {
    if (cookieConsentGiven() === 'undecided') {
      setIsOpen(true);
    }
  }, []);

  return (
    <div
      className={toClassName(
        styles.wrapper,
        isOpen ? styles.wrapperOpen : styles.wrapperClosed,
        hide && 'hidden',
      )}
    >
      <div className={styles.card}>
        <div className={styles.grid}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {dictionary.component.cookieConsent.title}
            </h1>
            <Icon accessor="cookie" className={styles.icon} />
          </div>
          <div className={styles.body}>
            <p className={styles.description}>
              {dictionary.component.cookieConsent.description}
              <br />
            </p>
          </div>
          <div className={styles.footer}>
            <Button
              variant="primary"
              onClick={handleClickAccept}
              className={styles.button}
            >
              {dictionary.component.cookieConsent.label.accept}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClickDecline}
              className={styles.button}
            >
              {dictionary.component.cookieConsent.label.decline}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
