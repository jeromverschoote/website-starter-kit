import { fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const BasicAccordion = ({ defaultValue }: { defaultValue?: string }) => (
  <Accordion type="single" collapsible defaultValue={defaultValue}>
    <AccordionItem value="item-1">
      <AccordionTrigger>Question 1</AccordionTrigger>
      <AccordionContent>Answer 1</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Question 2</AccordionTrigger>
      <AccordionContent>Answer 2</AccordionContent>
    </AccordionItem>
  </Accordion>
);

describe('Accordion', () => {
  it('renders all triggers', () => {
    render(<BasicAccordion />);
    expect(screen.getByRole('button', { name: /question 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /question 2/i })).toBeInTheDocument();
  });

  it('items are closed by default', () => {
    render(<BasicAccordion />);
    expect(screen.getByRole('button', { name: /question 1/i })).toHaveAttribute('data-state', 'closed');
  });

  it('opens an item when its trigger is clicked', () => {
    render(<BasicAccordion />);
    fireEvent.click(screen.getByRole('button', { name: /question 1/i }));
    expect(screen.getByRole('button', { name: /question 1/i })).toHaveAttribute('data-state', 'open');
  });

  it('closes an open item when its trigger is clicked again', () => {
    render(<BasicAccordion />);
    const trigger = screen.getByRole('button', { name: /question 1/i });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'closed');
  });

  it('opens the item specified by defaultValue', () => {
    render(<BasicAccordion defaultValue="item-2" />);
    expect(screen.getByRole('button', { name: /question 2/i })).toHaveAttribute('data-state', 'open');
    expect(screen.getByRole('button', { name: /question 1/i })).toHaveAttribute('data-state', 'closed');
  });

  it('applies a custom className to AccordionItem', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="custom-item">
          <AccordionTrigger>Q</AccordionTrigger>
          <AccordionContent>A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(document.querySelector('.custom-item')).toBeInTheDocument();
  });
});
