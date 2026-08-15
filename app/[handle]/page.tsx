import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { todayIso } from "@/lib/clock";
import { parseBlocks } from "@/lib/bio/blocks";
import { socialLabel } from "@/lib/bio/socials";
import { resolveTheme, themeVars } from "@/lib/bio/theme";
import { publicImageUrl } from "@/lib/bio/urls";
import * as dal from "@/lib/dal/bio";
import { BlockRenderer } from "./_components/blocks";

/** URLs look like /@handle; the leading @ is part of the segment. */
function readHandle(raw: string): string | null {
  const decoded = decodeURIComponent(raw);
  if (!decoded.startsWith("@")) return null;
  const handle = decoded.slice(1).toLowerCase();
  return handle.length > 0 ? handle : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[handle]">): Promise<Metadata> {
  const { handle: raw } = await params;
  const handle = readHandle(raw);
  if (!handle) return {};

  const found = await dal.getPublicPage(handle);
  if (!found) return {};

  const avatar = publicImageUrl(found.page.avatarKey);

  return {
    title: found.page.title,
    description: found.page.tagline ?? undefined,
    openGraph: {
      title: found.page.title,
      description: found.page.tagline ?? undefined,
      images: avatar ? [avatar] : undefined,
    },
  };
}

export default async function BioPublicPage({
  params,
}: PageProps<"/[handle]">) {
  const { handle: raw } = await params;
  const handle = readHandle(raw);
  if (!handle) notFound();

  const found = await dal.getPublicPage(handle);

  if (!found) {
    // A handle the artist used to have still gets people there.
    const current = await dal.resolveOldHandle(handle);
    if (current) redirect(`/@${current}`);
    notFound();
  }

  const { page, blocks: blockRows, socials } = found;
  const blocks = parseBlocks(blockRows);
  const theme = resolveTheme(page);
  const avatar = publicImageUrl(page.avatarKey);
  const background = publicImageUrl(page.backgroundValue);

  // Counted here rather than by beacon: the page is server-rendered per
  // request today. If it ever gets edge-cached, this moves to a beacon.
  await dal.recordView(page.id, await todayIso());

  const backgroundStyle =
    page.backgroundKind === "image" && background
      ? { backgroundImage: `url(${background})` }
      : page.backgroundKind === "gradient"
        ? {
            backgroundImage: `linear-gradient(160deg, ${theme.bg} 0%, color-mix(in oklab, ${theme.bg} 65%, black) 100%)`,
          }
        : undefined;

  return (
    <div
      style={{ ...themeVars(theme), ...backgroundStyle }}
      className="relative min-h-dvh bg-[var(--bio-bg)] bg-cover bg-center bg-fixed font-[family-name:var(--bio-font)] text-[var(--bio-fg)]"
    >
      {theme.needsScrim && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/55"
        />
      )}

      <main className="relative mx-auto w-full max-w-[34rem] px-6 py-16 sm:py-24">
        <header className="flex flex-col items-center text-center">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-24 w-24 rounded-full object-cover shadow-lg"
            />
          ) : (
            <span className="grid h-24 w-24 place-items-center rounded-full bg-[var(--bio-accent)] text-2xl font-semibold text-[var(--bio-accent-fg)]">
              {page.title.slice(0, 1).toUpperCase()}
            </span>
          )}

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-balance">
            {page.title}
          </h1>

          {page.tagline && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--bio-muted)] text-pretty">
              {page.tagline}
            </p>
          )}

          {socials.length > 0 && (
            <nav className="mt-6 flex flex-wrap justify-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-current/20 px-3.5 py-1.5 text-xs font-medium opacity-80 transition-opacity hover:opacity-100"
                >
                  {socialLabel(social.platform)}
                </a>
              ))}
            </nav>
          )}
        </header>

        {blocks.length > 0 && (
          <div className="mt-10 space-y-3.5">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )}

        <footer className="mt-16 text-center">
          <Link
            href="/"
            className="text-xs opacity-45 transition-opacity hover:opacity-80"
          >
            Made with Trenodo
          </Link>
        </footer>
      </main>
    </div>
  );
}
