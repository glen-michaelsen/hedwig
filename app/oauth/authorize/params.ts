/** The OAuth request fields carried from the consent page to the plugin. Nothing else passes. */
export const AUTHORIZE_PARAMS = [
  "client_id",
  "redirect_uri",
  "response_type",
  "state",
  "scope",
  "code_challenge",
  "code_challenge_method",
  "resource",
  "nonce",
] as const;

export type AuthorizeParams = Partial<Record<(typeof AUTHORIZE_PARAMS)[number], string>>;

export function pickParams(read: (key: string) => unknown): AuthorizeParams {
  const params: AuthorizeParams = {};
  for (const key of AUTHORIZE_PARAMS) {
    const value = read(key);
    if (typeof value === "string" && value) params[key] = value;
  }
  return params;
}
