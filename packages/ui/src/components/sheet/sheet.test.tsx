import { fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const BasicSheet = ({ open, side }: { open?: boolean; side?: 'left' | 'right' | 'top' | 'bottom' }) => (
  <Sheet open={open}>
    <SheetTrigger>Open sheet</SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Sheet title</SheetTitle>
        <SheetDescription>Sheet description</SheetDescription>
      </SheetHeader>
      <p>Sheet body</p>
      <SheetFooter>
        <button>Save</button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

describe('Sheet', () => {
  it('does not show content when closed', () => {
    render(<BasicSheet />);
    expect(screen.queryByText('Sheet body')).not.toBeInTheDocument();
  });

  it('shows content when open is true', () => {
    render(<BasicSheet open />);
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
  });

  it('renders title and description when open', () => {
    render(<BasicSheet open />);
    expect(screen.getByText('Sheet title')).toBeInTheDocument();
    expect(screen.getByText('Sheet description')).toBeInTheDocument();
  });

  it('renders footer content when open', () => {
    render(<BasicSheet open />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('opens when the trigger is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle className="hidden">T</SheetTitle>
          <p>Content</p>
        </SheetContent>
      </Sheet>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with the left side variant', () => {
    render(<BasicSheet open side="left" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
