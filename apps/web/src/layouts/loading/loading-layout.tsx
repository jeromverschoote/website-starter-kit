import { styles } from '.';

/** Route-level loading skeleton. Shape it to match the page it covers. */
const LoadingLayout = () => {
  return <div className={styles.container} aria-busy="true" aria-live="polite" />;
};

export default LoadingLayout;
