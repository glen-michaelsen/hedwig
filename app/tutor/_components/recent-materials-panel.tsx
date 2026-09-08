"use client";

import Link from "next/link";
import { useState } from "react";
import type { CreatedMaterial } from "../actions";
import { CreateMaterialModal } from "./create-material-modal";
import {
  Empty,
  KindBadge,
  Panel,
  PanelList,
  SectionTitle,
  buttonGhost,
  buttonQuiet,
  panelRow,
} from "@/app/_components/ui";

/**
 * The dashboard's own material widget — five most recent, with the same
 * create flow as the lesson note's inline modal. New materials are
 * prepended locally rather than waiting on a round trip, same pattern as
 * MaterialAttachField.
 */
export function RecentMaterialsPanel({
  materials,
  allTags,
}: {
  materials: CreatedMaterial[];
  allTags: string[];
}) {
  const [items, setItems] = useState(materials);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <section>
      <SectionTitle
        action={
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/tutor/library" className={buttonQuiet}>
              See all
            </Link>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className={buttonGhost}
            >
              Add material
            </button>
          </div>
        }
      >
        Material
      </SectionTitle>

      {items.length === 0 ? (
        <Empty>Nothing in your library yet.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {items.slice(0, 5).map((m) => (
              <li key={m.id}>
                <Link href={`/tutor/library/${m.id}`} className={panelRow}>
                  <KindBadge kind={m.kind} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {m.title}
                  </span>
                </Link>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}

      <CreateMaterialModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        allTags={allTags}
        submitLabel="Create material"
        onCreated={(material) =>
          setItems((current) => [material, ...current])
        }
      />
    </section>
  );
}
