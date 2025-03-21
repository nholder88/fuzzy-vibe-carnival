// Type definitions for Storybook environment
import { User } from '../lib/types';

// Extended window interface for Storybook mocks
interface StorybookWindow {
  useRouter?: () => {
    push: (path: string) => Promise<boolean>;
    replace: (path: string) => Promise<boolean>;
    prefetch: (path: string) => Promise<void>;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    pathname: string;
  };

  usePathname?: () => string;
  useSearchParams?: () => URLSearchParams;

  useUser?: () => {
    user: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    switchUser: (userId: string) => Promise<void>;
  };
}

declare global {
  interface Window extends StorybookWindow {}
}
