import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { parseBlocks } from "@/lib/bio/blocks";
import { bioPageUrl } from "@/lib/bio/urls";
import * as dal from "@/lib/dal/bio";
import { listReleaseLinks } from "@/lib/dal/press";
import {
  PageHeader,
  SectionTitle,
  button,
  buttonGhost,
} from "@/app/_components/ui";
import { AppearanceForm } from "./_components/appearance-form";
import { BlockEditor } from "./_components/block-editor";
import { ClaimHandle } from "./_components/claim-handle";
import { ProfileForm } from "./_components/profile-form";
import { SocialsForm } from "./_components/socials-form";
import { setPublishedAction } from "./actions";

export default async function BioEditorPage() {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);

  if (!page) {
    return (
      <>
        <PageHeader
          title="Link in Bio"
          subtitle="One page for everything you point people at — your music, your links, your lessons."
        />
        <ClaimHandle defaultTitle={account.studioName || account.name} />
      </>
    );
  }

  const [blockRows, socials, stats, releases] = await Promise.all([
    dal.listBlocks(page.id),
    dal.listSocials(page.id),
    dal.getStats(page.id),
    listReleaseLinks(account.id),
  ]);

  const blocks = parseBlocks(blockRows);
  const clicks = Object.fromEntries(stats.clicksByBlock);
  const url = bioPageUrl(page.handle);
  const viewUrl = page.published ? url : `${url}?preview=1`;

  return (
    <>
      <PageHeader
        title="Link in Bio"
        subtitle={
          <>
            Live at{" "}
            <Link href={url} className="font-medium text-brand-600 hover:underline">
              /@{page.handle}
            </Link>
            . Changes save straight to the live page.
          </>
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={viewUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonGhost}
            >
              View page
            </Link>
            <form action={setPublishedAction}>
              <input
                type="hidden"
                name="published"
                value={page.published ? "false" : "true"}
              />
              <button className={page.published ? buttonGhost : button}>
                {page.published ? "Unpublish" : "Publish"}
              </button>
            </form>
          </div>
        }
      />

      {!page.published && (
        <p className="mb-10 rounded-3xl bg-amber-500/10 px-5 py-4 text-sm text-amber-700">
          This page isn&rsquo;t published yet — only you can see it. Publish
          when you&rsquo;re happy with it.
        </p>
      )}

      <div className="space-y-14">
        <section>
          <BlockEditor blocks={blocks} clicks={clicks} releases={releases} />
        </section>

        <section>
          <SectionTitle hint="Name, photo and the address people type.">
            Profile
          </SectionTitle>
          <ProfileForm page={page} />
        </section>

        <section>
          <SectionTitle hint="A theme to start from, then make it yours.">
            Appearance
          </SectionTitle>
          <AppearanceForm page={page} />
        </section>

        <section>
          <SectionTitle>Social links</SectionTitle>
          <SocialsForm socials={socials} />
        </section>

        <section>
          <SectionTitle>Traffic</SectionTitle>
          <div className="rounded-4xl border border-line bg-surface p-7 shadow-soft">
            <p className="text-4xl font-semibold tabular-nums">{stats.views}</p>
            <p className="mt-1.5 text-sm text-muted">
              {stats.views === 1 ? "page view" : "page views"} since you
              published
            </p>
            <p className="mt-4 text-xs text-faint">
              Clicks per block show next to each one above.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
