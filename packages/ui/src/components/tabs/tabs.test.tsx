import { fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it, vi } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const BasicTabs = ({ defaultValue = 'tab1' }: { defaultValue?: string }) => (
  <Tabs defaultValue={defaultValue}>
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </Tabs>
);

describe('Tabs', () => {
  it('renders all tab triggers', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
  });

  it('shows the default tab content', () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('marks the default tab as active', () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'inactive');
  });

  it('shows the correct content when value changes (controlled)', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    rerender(
      <Tabs value="tab2" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('calls onValueChange when a tab is clicked', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.pointerDown(tab2, { button: 0, ctrlKey: false });
    fireEvent.mouseDown(tab2);
    fireEvent.click(tab2);
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });

  it('applies a custom className to TabsList', () => {
    render(
      <Tabs defaultValue="t1">
        <TabsList className="custom-list">
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
        <TabsContent value="t1">C1</TabsContent>
      </Tabs>,
    );
    expect(document.querySelector('.custom-list')).toBeInTheDocument();
  });
});
