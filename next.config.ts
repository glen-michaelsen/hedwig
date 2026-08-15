import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  experimental: {
    // Sheet music PDFs are uploaded through a Server Action.
    serverActions: { bodySizeLimit: "25mb" },
  },

  /**
   * hedwig used to be a tutoring app, so everything signed-in lived under
   * /admin. It's a toolbox now: tutoring is one tool at /studio, and the
   * account itself owns /account. Bookmarks and any printed link keep
   * working — these stay for good.
   */
  async redirects() {
    return [
      // One canonical origin. Better Auth's CSRF check is tied to APP_URL,
      // so signing in on www would fail rather than just look untidy.
      // The root needs its own rule — an empty `:path*` is not interpolated
      // away, it redirects to the literal ":path*".
      {
        source: "/",
        has: [{ type: "host", value: "www.trenodo.com" }],
        destination: "https://trenodo.com/",
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "www.trenodo.com" }],
        destination: "https://trenodo.com/:path+",
        permanent: true,
      },
      // The teaching tool was briefly called Studio. "Studio" reads as a
      // recording room to musicians, so it's Tutor now — but the old paths
      // were live, so they keep resolving.
      { source: "/studio", destination: "/tutor", permanent: true },
      {
        source: "/studio/:path+",
        destination: "/tutor/:path+",
        permanent: true,
      },
      // The bare paths need their own rules: an empty `:path*` is not
      // interpolated away, it redirects to the literal ":path*".
      { source: "/admin/students", destination: "/tutor/students", permanent: true },
      { source: "/admin/library", destination: "/tutor/library", permanent: true },
      {
        source: "/admin/students/:path+",
        destination: "/tutor/students/:path+",
        permanent: true,
      },
      {
        source: "/admin/library/:path+",
        destination: "/tutor/library/:path+",
        permanent: true,
      },
      { source: "/admin/settings", destination: "/account/settings", permanent: true },
      { source: "/admin/login", destination: "/account/login", permanent: true },
      { source: "/admin/signup", destination: "/account/signup", permanent: true },
      // Anything else under the old prefix lands on the tool dashboard.
      { source: "/admin/:path*", destination: "/account", permanent: true },
      { source: "/admin", destination: "/account", permanent: true },
    ];
  },
};

export default nextConfig;

// Gives `next dev` the same D1/R2 bindings the deployed Worker gets.
initOpenNextCloudflareForDev();
