import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const BasicSelect = ({ disabled }: { disabled?: boolean }) => (
  <Select>
    <SelectTrigger disabled={disabled} aria-label="Pick a fruit">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

describe('Select', () => {
  it('renders the trigger with a placeholder', () => {
    render(<BasicSelect />);
    expect(screen.getByText('Select a fruit')).toBeInTheDocument();
  });

  it('renders the trigger button', () => {
    render(<BasicSelect />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<BasicSelect disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies a custom className to the trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger" aria-label="Pick">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
  });
});
