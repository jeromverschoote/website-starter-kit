import { render, screen } from '@testing-library/react';

import { describe, it, expect } from 'vitest';

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

const ToastWrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    {children}
    <ToastViewport />
  </ToastProvider>
);

describe('Toast', () => {
  it('renders Toast with default variant', () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastTitle>Hello</ToastTitle>
        </Toast>
      </ToastWrapper>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders destructive variant without crashing', () => {
    render(
      <ToastWrapper>
        <Toast open variant="destructive">
          <ToastTitle>Error</ToastTitle>
        </Toast>
      </ToastWrapper>,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders ToastDescription', () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastDescription>Something went wrong.</ToastDescription>
        </Toast>
      </ToastWrapper>,
    );
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('renders ToastAction with altText', () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastAction altText="Try again">Retry</ToastAction>
        </Toast>
      </ToastWrapper>,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('renders ToastClose button', () => {
    const { container } = render(
      <ToastWrapper>
        <Toast open>
          <ToastClose />
        </Toast>
      </ToastWrapper>,
    );
    // ToastClose renders an icon-only button with no accessible name
    expect(container.querySelector('[toast-close]')).toBeInTheDocument();
  });

  it('renders ToastTitle and ToastDescription together', () => {
    render(
      <ToastWrapper>
        <Toast open>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>Your form was submitted.</ToastDescription>
        </Toast>
      </ToastWrapper>,
    );
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Your form was submitted.')).toBeInTheDocument();
  });
});
