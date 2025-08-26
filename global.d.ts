declare module 'google-one-tap' {
  interface GoogleOneTapConfig {
    client_id: string;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    prompt_parent_id?: string;
    nonce?: string;
    state_cookie_domain?: string;
    ux_mode?: 'popup' | 'redirect';
    login_uri?: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default function googleOneTap(config: GoogleOneTapConfig, callback: (response: any) => void): void;
}

declare namespace google {
  namespace accounts {
    namespace id {
      interface CredentialResponse {
        credential: string;
        select_by: string;
        clientId: string;
      }

      function initialize(config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
      }): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function prompt(callback?: (notification: any) => void): void;
    }
  }
}
