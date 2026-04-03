import { createRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with a placeholder', () => {
    render(<Textarea placeholder="Write something..." />);
    expect(screen.getByPlaceholderText('Write something...')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('calls onChange when the value changes', () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('forwards a custom className', () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('forwards a ref to the textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('renders with a controlled value', () => {
    render(<Textarea value="initial value" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('initial value');
  });
});
