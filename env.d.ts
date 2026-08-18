// Bindings and secrets available via getCloudflareContext().env.
// The Cloudflare runtime types themselves live in worker-configuration.d.ts,
// regenerated with `npm run cf:types` whenever wrangler.jsonc changes.
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    MEDIA: R2Bucket;
    IMAGES: ImagesBinding;
    APP_URL: string;
    /** Email of the one platform admin. See isAdmin() in lib/auth.ts. */
    ADMIN_EMAIL?: string;
    /** Secret. Signs tutor sessions. */
    BETTER_AUTH_SECRET: string;
    /** Secret. Signs the student portal cookie. */
    STUDENT_SESSION_SECRET: string;
  }
}

export {};
