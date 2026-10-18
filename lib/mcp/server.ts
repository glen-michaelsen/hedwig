import "server-only";
import { z } from "zod";
import { TOOLS } from "./tools";

/**
 * The MCP protocol, as much of it as a read-only tool server needs:
 * initialize, ping, tools/list and tools/call, answered as plain JSON
 * (the stateless form of the Streamable HTTP transport). No sessions and
 * no server-sent events, so nothing has to outlive a request on Workers.
 */

const PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

type Message = { jsonrpc?: string; id?: string | number | null; method?: string; params?: unknown };
type Context = { appUrl: string; adminId: string };

const result = (id: Message["id"], value: unknown) => ({ jsonrpc: "2.0", id, result: value });
const failure = (id: Message["id"], code: number, message: string) => ({
  jsonrpc: "2.0",
  id: id ?? null,
  error: { code, message },
});

const INSTRUCTIONS =
  "Trenodo's admin data, read only: press kits (releases with files and tags), Spotlight articles, the Spotlight board, musicians, Discover pages and ideas. Use list_* tools to find ids, then get_* for detail.";

async function handle(message: Message, ctx: Context) {
  const { id, method } = message;
  const params = (message.params ?? {}) as Record<string, unknown>;

  switch (method) {
    case "initialize": {
      const asked = typeof params.protocolVersion === "string" ? params.protocolVersion : "";
      return result(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "trenodo", title: "Trenodo", version: "1.0.0" },
        instructions: INSTRUCTIONS,
      });
    }
    case "ping":
      return result(id, {});
    case "tools/list":
      return result(id, {
        tools: TOOLS.map((tool) => {
          const inputSchema: Record<string, unknown> = z.toJSONSchema(tool.input, { io: "input" });
          delete inputSchema.$schema;
          return {
            name: tool.name,
            title: tool.title,
            description: tool.description,
            inputSchema,
            annotations: { title: tool.title, readOnlyHint: true, openWorldHint: false },
          };
        }),
      });
    case "tools/call": {
      const tool = TOOLS.find((candidate) => candidate.name === params.name);
      if (!tool) return failure(id, -32602, `Unknown tool: ${String(params.name)}`);
      const parsed = tool.input.safeParse(params.arguments ?? {});
      if (!parsed.success) {
        return result(id, {
          isError: true,
          content: [{ type: "text", text: `Invalid arguments: ${z.prettifyError(parsed.error)}` }],
        });
      }
      try {
        const output = await tool.run(parsed.data as never, ctx);
        // Tools report "not found" as { error }, which Claude should see as a failed call.
        const failed = typeof output === "object" && output !== null && "error" in output;
        return result(id, {
          ...(failed && { isError: true }),
          content: [{ type: "text", text: JSON.stringify(output, null, 1) }],
        });
      } catch (error) {
        console.error(`mcp: ${tool.name} failed`, error);
        return result(id, {
          isError: true,
          content: [{ type: "text", text: "That didn't work on Trenodo's side. Try again." }],
        });
      }
    }
    default:
      return failure(id, -32601, `Method not found: ${method}`);
  }
}

/** One POST body: a message or a batch. Notifications get no answer; if that's all there is, 202. */
export async function handleMcpBody(body: unknown, ctx: Context): Promise<Response> {
  const messages = (Array.isArray(body) ? body : [body]) as Message[];
  if (messages.length === 0 || messages.some((m) => typeof m !== "object" || m === null)) {
    return Response.json(failure(null, -32600, "Invalid request"), { status: 400 });
  }

  const answers = [];
  for (const message of messages) {
    // Notifications (no id) and responses to us (no method) need no reply.
    if (message.id === undefined || message.id === null || typeof message.method !== "string") continue;
    answers.push(await handle(message, ctx));
  }

  if (answers.length === 0) return new Response(null, { status: 202 });
  return Response.json(Array.isArray(body) ? answers : answers[0]);
}
