const Image = ({ src, alt, fill: _fill, ...props }: any) => (
  <img
    src={typeof src === 'object' ? (src?.src ?? '') : src}
    alt={alt}
    {...props}
  />
);

export default Image;
