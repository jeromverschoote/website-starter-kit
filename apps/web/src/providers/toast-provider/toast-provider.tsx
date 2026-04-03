'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as Provider,
  ToastTitle,
  ToastViewport,
} from '@repo/ui/toast';

import { useToast } from 'hooks/use-toast';

const ToastProvider = () => {
  const { toasts } = useToast();

  return (
    <Provider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white">
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </Provider>
  );
};

export default ToastProvider;
