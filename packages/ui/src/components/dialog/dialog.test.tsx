import { fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const BasicDialog = ({ open }: { open?: boolean }) => (
  <Dialog open={open}>
    <DialogTrigger>Open dialog</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dialog title</DialogTitle>
        <DialogDescription>Dialog description</DialogDescription>
      </DialogHeader>
      <p>Dialog body</p>
      <DialogFooter>
        <button>Confirm</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

describe('Dialog', () => {
  it('does not show content when closed', () => {
    render(<BasicDialog />);
    expect(screen.queryByText('Dialog body')).not.toBeInTheDocument();
  });

  it('shows content when open is true', () => {
    render(<BasicDialog open />);
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
  });

  it('renders title and description when open', () => {
    render(<BasicDialog open />);
    expect(screen.getByText('Dialog title')).toBeInTheDocument();
    expect(screen.getByText('Dialog description')).toBeInTheDocument();
  });

  it('renders footer content when open', () => {
    render(<BasicDialog open />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('opens when the trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle className="hidden">T</DialogTitle>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
