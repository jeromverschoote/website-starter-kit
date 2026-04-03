import { fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

const BasicDropdown = ({ open }: { open?: boolean }) => (
  <DropdownMenu open={open}>
    <DropdownMenuTrigger>Options</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

describe('DropdownMenu', () => {
  it('renders the trigger', () => {
    render(<BasicDropdown />);
    expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
  });

  it('does not show content when closed', () => {
    render(<BasicDropdown />);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('shows content when open is true', () => {
    render(<BasicDropdown open />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders a label when open', () => {
    render(<BasicDropdown open />);
    expect(screen.getByText('My Account')).toBeInTheDocument();
  });

  it('fires onOpenChange when the trigger is activated', () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole('button', { name: 'Options' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('calls onClick on a menu item', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onClick}>Action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    fireEvent.click(screen.getByText('Action'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders DropdownMenuCheckboxItem', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Enable feature</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });

  it('renders DropdownMenuRadioGroup with RadioItems', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('renders DropdownMenuShortcut', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Save <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByText('⌘S')).toBeInTheDocument();
  });

  it('renders DropdownMenuSub with SubTrigger and SubContent', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByText('More options')).toBeInTheDocument();
    expect(screen.getByText('Sub item')).toBeInTheDocument();
  });
});
