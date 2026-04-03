import { vi } from 'vitest';

const posthog = {
  opt_in_capturing: vi.fn(),
  opt_out_capturing: vi.fn(),
  set_config: vi.fn(),
  capture: vi.fn(),
};

export default posthog;
