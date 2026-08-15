import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every route in hedwig is per-tutor or per-student, so nothing is worth
// caching across requests yet. Add an incrementalCache override here if
// public marketing pages get added later.
export default defineCloudflareConfig({});
