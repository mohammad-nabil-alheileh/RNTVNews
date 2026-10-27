export interface Session {
  signedInAt: string;
}

export interface SessionState {
  loaded: boolean;
  session: Session | null;
}

export interface SignInCode {
  code: string;
  approveUrl: string;
  expiresAt: number;
}

export type PhoneSignInState = SignInCode & {
  notice?: 'expired';
  connectionProblem: boolean;
};
