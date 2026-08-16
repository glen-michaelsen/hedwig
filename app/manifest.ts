import type { MetadataRoute } from "next";

/**
 * Android and desktop "add to home screen". Apple ignores this and uses
 * app/apple-icon.png instead.
 *
 * `theme_color` is the brand purple rather than the page background — it
 * tints the status bar when the app is launched from the home screen.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trenodo",
    short_name: "Trenodo",
    description:
      "Making life simpler and more efficient for musicians — teaching, links and press, in one account.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfaf6",
    theme_color: "#825abe",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
