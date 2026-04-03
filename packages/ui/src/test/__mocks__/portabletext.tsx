export const PortableText = ({ value }: { value: unknown }) => (
  <div data-testid="portable-text">{JSON.stringify(value)}</div>
);
