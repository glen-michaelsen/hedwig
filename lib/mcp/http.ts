/** Discovery documents and the MCP endpoint are read cross-origin by browser-based clients. */
export const discoveryHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, authorization, mcp-protocol-version, mcp-session-id",
  "access-control-max-age": "86400",
};
