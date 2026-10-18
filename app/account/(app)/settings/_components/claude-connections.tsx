import { Card, actionPill, label } from "@/app/_components/ui";
import { listConnections } from "@/lib/dal/oauth";
import { disconnectAppAction } from "../actions";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(value);
}

/** Admin only: the address to give Claude, and the apps that are connected. */
export async function ClaudeConnections({ adminId, appUrl }: { adminId: string; appUrl: string }) {
  const connections = await listConnections(adminId);

  return (
    <Card className="sm:col-span-2">
      <p className={label}>Claude connector</p>
      <p className="text-sm text-muted">
        Read-only access to press kits, Spotlights, musicians and ideas. In Claude, add a custom
        connector with this address:
      </p>
      <p className="mt-3 select-all rounded-2xl bg-surface-muted px-4 py-3 font-mono text-sm">{appUrl}/api/mcp</p>

      <p className="mt-6 text-sm font-medium">Connected</p>
      {connections.length === 0 ? (
        <p className="mt-1 text-sm text-muted">Nothing yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {connections.map((connection) => (
            <li key={connection.clientId} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{connection.name}</p>
                <p className="truncate text-xs text-muted">
                  {connection.host} · last signed in {formatDate(connection.lastUsed)}
                </p>
              </div>
              <form action={disconnectAppAction}>
                <input type="hidden" name="clientId" value={connection.clientId} />
                <button className={actionPill}>Disconnect</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
