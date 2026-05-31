import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import DynamicSections from './dynamic-sections';
import type { TSection, TSectionComponent } from './registry';

const Hero: TSectionComponent = ({ section }) => (
  <div data-testid="hero">{section._type}</div>
);

const components: Record<string, TSectionComponent> = { 'hero-section': Hero };

describe('DynamicSections', () => {
  it('renders nothing when there are no sections', () => {
    const { container } = render(<DynamicSections sections={[]} components={components} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the registered component for a known section type', () => {
    const sections: TSection[] = [{ _key: 'a', _type: 'hero-section' }];
    render(<DynamicSections sections={sections} components={components} />);
    expect(screen.getByTestId('hero')).toHaveTextContent('hero-section');
  });

  it('skips section types with no registered component', () => {
    const sections: TSection[] = [{ _key: 'a', _type: 'unknown-section' }];
    const { container } = render(<DynamicSections sections={sections} components={components} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('wraps a section with a sectionId in an anchor element', () => {
    const sections: TSection[] = [
      { _key: 'a', _type: 'hero-section', sectionId: 'intro' },
    ];
    const { container } = render(<DynamicSections sections={sections} components={components} />);
    expect(container.querySelector('#intro')).not.toBeNull();
  });
});
