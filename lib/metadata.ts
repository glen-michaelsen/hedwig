import type { Metadata } from "next";

/**
 * Browser-tab titles for the signed-in tools all read "<where you are> —
 * Trenodo". Each dashboard layout spreads this so its pages only have to name
 * the leaf ("Press Kit", "Setlist: Friday at the Vega"); the public marketing
 * pages set their own absolute titles and don't go through here.
 */
export const dashboardMetadata: Metadata = {
  title: {
    default: "Trenodo",
    template: "%s — Trenodo",
  },
};
