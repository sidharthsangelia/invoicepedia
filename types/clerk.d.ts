export {};

declare global {
  interface CustomJwtSessionClaims {
    publicMetadata?: {
      onboarded?: boolean;
    };
  }
}