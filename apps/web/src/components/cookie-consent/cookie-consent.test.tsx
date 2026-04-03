import { fireEvent, render, screen } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TDictionary } from 'config/i18n';

import CookieConsent from './cookie-consent';

const dict = {
  component: {
    cookieConsent: {
      title: 'Cookie Consent',
      description: 'We use cookies to improve your experience.',
      label: { accept: 'Accept', decline: 'Decline' },
    },
  },
} as unknown as TDictionary;

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the consent banner when no decision has been made', () => {
    render(<CookieConsent dictionary={dict} />);
    expect(screen.getByText('Cookie Consent')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<CookieConsent dictionary={dict} />);
    expect(
      screen.getByText('We use cookies to improve your experience.'),
    ).toBeInTheDocument();
  });

  it('renders Accept and Decline buttons', () => {
    render(<CookieConsent dictionary={dict} />);
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();
  });

  it('stores "yes" in localStorage when Accept is clicked', () => {
    render(<CookieConsent dictionary={dict} />);
    fireEvent.click(screen.getByText('Accept'));
    expect(localStorage.getItem('cookie_consent')).toBe('yes');
  });

  it('stores "no" in localStorage when Decline is clicked', () => {
    render(<CookieConsent dictionary={dict} />);
    fireEvent.click(screen.getByText('Decline'));
    expect(localStorage.getItem('cookie_consent')).toBe('no');
  });

  it('calls posthog.opt_in_capturing when accepted', async () => {
    const posthog = (await import('posthog-js')).default;
    render(<CookieConsent dictionary={dict} />);
    fireEvent.click(screen.getByText('Accept'));
    expect(posthog.opt_in_capturing).toHaveBeenCalled();
  });

  it('calls posthog.opt_out_capturing when declined', async () => {
    const posthog = (await import('posthog-js')).default;
    render(<CookieConsent dictionary={dict} />);
    fireEvent.click(screen.getByText('Decline'));
    expect(posthog.opt_out_capturing).toHaveBeenCalled();
  });
});
