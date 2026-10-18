import { Card, button, buttonGhost } from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { getOAuthClient, hostOf } from "@/lib/dal/oauth";
import { allowAction, denyAction } from "./actions";
import { pickParams } from "./params";

export const metadata = { title: "Connect an app" };
export const dynamic = "force-dynamic";

const CAN_READ = [
  "Press kits, with their files and details",
  "Spotlight articles and the board",
  "Musicians, Discover pages and ideas",
];

/**
 * Where Claude sends the admin to connect the Trenodo MCP. Nothing is
 * granted until the admin presses Allow, and only the admin gets this
 * far: anyone else sees a 404.
 */
export default async function AuthorizePage({ searchParams }: PageProps<"/oauth/authorize">) {
  const query = await searchParams;
  const here = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") here.set(key, value);
  }
  await requireAdmin(`/oauth/authorize?${here.toString()}`);

  const params = pickParams((key) => query[key]);
  const client =
    params.client_id && params.redirect_uri
      ? await getOAuthClient(params.client_id, params.redirect_uri)
      : null;

  if (!client || params.response_type !== "code" || !params.code_challenge) {
    return (
      <Card raised>
        <h1 className="text-2xl font-semibold tracking-tight">This link doesn&rsquo;t work</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Start again from the app you&rsquo;re connecting.
        </p>
      </Card>
    );
  }

  const hidden = Object.entries(params).map(([key, value]) => (
    <input key={key} type="hidden" name={key} value={value} />
  ));

  return (
    <Card raised>
      <h1 className="text-2xl font-semibold tracking-tight">Let {client.name} read Trenodo?</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        It gets read-only access to the admin side. It can&rsquo;t change anything.
      </p>

      <ul className="mt-6 space-y-2 text-sm">
        {CAN_READ.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-2xl bg-surface-muted px-4 py-3 text-sm text-muted">
        Access goes to <span className="font-semibold text-foreground">{hostOf(client.redirectUri)}</span>
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <form action={allowAction}>
          {hidden}
          <button className={button}>Allow</button>
        </form>
        <form action={denyAction}>
          {hidden}
          <button className={buttonGhost}>Don&rsquo;t allow</button>
        </form>
      </div>

      <p className="mt-6 text-xs text-faint">You can disconnect it any time in Settings.</p>
    </Card>
  );
}
