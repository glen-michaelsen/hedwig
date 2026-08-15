"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { pinToShelfAction } from "../../../actions";
import { Modal } from "@/app/_components/modal";
import {
  KindBadge,
  actionPill,
  actionPillBrand,
  buttonGhost,
  input,
} from "@/app/_components/ui";

export type PickableMaterial = {
  id: string;
  kind: "pdf" | "link" | "video";
  title: string;
  description: string | null;
  tags: string[];
};

export function PinMaterialModal({
  studentId,
  studentName,
  materials,
  pinnedIds,
}: {
  studentId: string;
  studentName: string;
  materials: PickableMaterial[];
  pinnedIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [justPinned, setJustPinned] = useState<string[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Merged rather than copied into state, so a revalidation of the page
  // underneath doesn't fight with what we've pinned in this session.
  const pinned = useMemo(
    () => new Set([...pinnedIds, ...justPinned]),
    [pinnedIds, justPinned],
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const m of materials) for (const t of m.tags) set.add(t);
    return [...set].sort();
  }, [materials]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return materials.filter((m) => {
      if (activeTag && !m.tags.includes(activeTag)) return false;
      if (!needle) return true;
      return (
        m.title.toLowerCase().includes(needle) ||
        (m.description?.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [materials, query, activeTag]);

  function pin(materialId: string) {
    setPendingId(materialId);
    const formData = new FormData();
    formData.set("studentId", studentId);
    formData.set("materialId", materialId);

    startTransition(async () => {
      await pinToShelfAction(formData);
      setJustPinned((current) => [...current, materialId]);
      setPendingId(null);
    });
  }

  return (
    <>
      <button className={buttonGhost} onClick={() => setOpen(true)}>
        Pin from library
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Pin to ${studentName}'s shelf`}
        description="Stays available to them, whichever lesson it came from."
        toolbar={
          <>
            <input
              autoFocus
              className={`${input} mt-5`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your library"
              aria-label="Search your library"
            />

            {allTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTag(null)}
                  className={activeTag === null ? actionPillBrand : actionPill}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={activeTag === tag ? actionPillBrand : actionPill}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </>
        }
        footer={
          <button className={buttonGhost} onClick={() => setOpen(false)}>
            Done
          </button>
        }
      >
        {materials.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-muted">Your library is empty.</p>
            <Link href="/tutor/library/new" className={`${actionPill} mt-4`}>
              Add material
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted">
            Nothing matches that.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((material) => {
              const isPinned = pinned.has(material.id);
              return (
                <li
                  key={material.id}
                  className="flex items-start gap-4 px-6 py-4 sm:px-7"
                >
                  <span className="pt-0.5">
                    <KindBadge kind={material.kind} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {material.title}
                    </p>
                    {material.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted">
                        {material.description}
                      </p>
                    )}
                    {material.tags.length > 0 && (
                      <p className="mt-1.5 text-xs text-faint">
                        {material.tags.join(" · ")}
                      </p>
                    )}
                  </div>

                  {isPinned ? (
                    <span className="shrink-0 rounded-full bg-surface-muted px-3.5 py-2 text-xs font-medium leading-none text-faint">
                      Pinned
                    </span>
                  ) : (
                    <button
                      onClick={() => pin(material.id)}
                      disabled={pendingId === material.id}
                      className={`${actionPillBrand} shrink-0`}
                    >
                      {pendingId === material.id ? "Pinning…" : "Pin"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </>
  );
}
