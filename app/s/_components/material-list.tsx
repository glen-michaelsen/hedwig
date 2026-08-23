"use client";

import { useState } from "react";
import type { StudentMaterial } from "@/lib/dal/student";
import { embedUrl } from "@/lib/embed";
import { Modal } from "@/app/_components/modal";
import { KindBadge, actionPill, focusable } from "@/app/_components/ui";

/**
 * Compact chips, two per line — a student scanning for "the Wonderwall one"
 * reads the name, not a description.
 *
 * PDFs and videos open in a modal so practice stays on this page. Links go
 * out to the site they came from: chord and theory sites routinely refuse to
 * be framed, and a blank modal is worse than a new tab.
 */
export function MaterialList({ materials }: { materials: StudentMaterial[] }) {
  const [openItem, setOpenItem] = useState<StudentMaterial | null>(null);

  const embed =
    openItem?.kind === "video" && openItem.url
      ? embedUrl(openItem.url, openItem.embedProvider)
      : null;

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2">
        {materials.map((m) => {
          const chip =
            "flex w-full min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-left shadow-soft transition-all hover:-translate-y-px hover:shadow-lift";

          return (
            <li key={m.id} className="min-w-0">
              {m.kind === "link" ? (
                <a
                  href={m.url ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`${chip} ${focusable}`}
                >
                  <KindBadge kind={m.kind} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {m.title}
                  </span>
                </a>
              ) : (
                <button
                  onClick={() => setOpenItem(m)}
                  className={`${chip} ${focusable}`}
                >
                  <KindBadge kind={m.kind} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {m.title}
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <Modal
        open={openItem !== null}
        onClose={() => setOpenItem(null)}
        title={openItem?.title ?? ""}
        size="lg"
        footer={
          openItem?.kind === "pdf" ? (
            <a
              href={`/s/m/${openItem.id}`}
              target="_blank"
              rel="noreferrer"
              className={actionPill}
            >
              Open in new tab
            </a>
          ) : undefined
        }
      >
        {openItem?.kind === "pdf" && (
          <div className="bg-surface-muted">
            <iframe
              src={`/s/m/${openItem.id}`}
              title={openItem.title}
              className="h-[74vh] w-full"
            />
          </div>
        )}

        {openItem?.kind === "video" &&
          (embed ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={embed}
                title={openItem.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            // A video we can't embed — send them to it rather than show a
            // broken frame.
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-muted">
                This one opens on its own site.
              </p>
              <a
                href={openItem.url ?? "#"}
                target="_blank"
                rel="noreferrer noopener"
                className={`${actionPill} mt-4`}
              >
                Watch it there
              </a>
            </div>
          ))}
      </Modal>
    </>
  );
}
