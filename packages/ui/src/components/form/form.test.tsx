import { render, screen } from '@testing-library/react';

import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';

import { Input } from '../input/input';

// Wrapper that provides a real react-hook-form context
const TestForm = ({ children }: { children: React.ReactNode }) => {
  const form = useForm({ defaultValues: { username: '' } });
  return <Form {...form}>{children}</Form>;
};

describe('Form', () => {
  it('renders FormItem with a label and control', () => {
    render(
      <TestForm>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('associates the label with the input via htmlFor', () => {
    render(
      <TestForm>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('renders a FormDescription', () => {
    render(
      <TestForm>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Must be at least 3 characters.</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(screen.getByText('Must be at least 3 characters.')).toBeInTheDocument();
  });

  it('marks the control as aria-invalid when there is an error', async () => {
    const TestFormWithError = () => {
      const form = useForm({
        defaultValues: { username: '' },
        errors: { username: { type: 'required', message: 'validation.required' } },
      });
      return (
        <Form {...form}>
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      );
    };

    render(<TestFormWithError />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders FormMessage with error text resolved from dictionary', () => {
    const TestFormWithMessage = () => {
      const form = useForm({
        defaultValues: { username: '' },
        errors: { username: { type: 'required', message: 'validation.required' } },
      });
      return (
        <Form {...form}>
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage dictionary={{ validation: { required: 'This field is required.' } }} />
              </FormItem>
            )}
          />
        </Form>
      );
    };

    render(<TestFormWithMessage />);
    expect(screen.getByText('This field is required.')).toBeInTheDocument();
  });

  it('renders nothing for FormMessage when there is no error and no children', () => {
    const TestFormNoError = () => {
      const form = useForm({ defaultValues: { username: '' } });
      return (
        <Form {...form}>
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage dictionary={{}} />
              </FormItem>
            )}
          />
        </Form>
      );
    };

    const { container } = render(<TestFormNoError />);
    expect(container.querySelector('[data-slot="form-message"]')).toBeNull();
  });
});
