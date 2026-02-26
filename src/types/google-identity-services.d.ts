export {};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize?: (config: unknown) => void;
          prompt?: (callback?: (notification: unknown) => void) => void;
          disableAutoSelect?: () => void;
          storeCredential?: (credentials: unknown) => void;
          cancel?: () => void;
          onGoogleLibraryLoad?: () => void;
          revoke?: (accessToken: string, done?: () => void) => void;
        };
        oauth2?: {
          initTokenClient?: (config: unknown) => unknown;
          initCodeClient?: (config: unknown) => unknown;
        };
      };
    };
  }
}

