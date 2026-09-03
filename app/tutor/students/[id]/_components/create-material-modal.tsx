"use client";

import { useActionState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  createMaterialInlineAction,
  type CreatedMaterial,
  type NewMaterialState,
} from "../../../actions";
import { MaterialFormFields } from "../../../_components/material-form-fields";
import { Modal } from "@/app/_components/modal";
import { ErrorText, button } from "@/app/_components/ui";

/**
 * Creates a material without leaving the lesson note — the alternative is
 * navigating to /tutor/library/new and losing whatever's half-written in
 * the note form. Modal fully unmounts on close (Modal itself returns null
 * when closed), so every open starts from a fresh useActionState({}) —
 * no stale state to guard against between one material and the next.
 *
 * Portalled to document.body rather than rendered in place: this sits
 * inside the note's own <form>, and a <form> nested inside another <form>
 * is invalid HTML that browsers handle unpredictably (same reasoning as
 * DropdownMenu elsewhere in this app). Guarded by `open` — which only ever
 * becomes true from a client click — so document.body is never touched
 * during server rendering.
 */
export function CreateMaterialModal({
  open,
  onClose,
  allTags,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  allTags: string[];
  onCreated: (material: CreatedMaterial) => void;
}) {
  const [state, action, pending] = useActionState<NewMaterialState, FormData>(
    createMaterialInlineAction,
    {},
  );

  useEffect(() => {
    if (state.material) {
      onCreated(state.material);
      onClose();
    }
    // Only ever fires once per successful submission — the modal unmounts
    // right after, taking this state with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.material]);

  if (!open) return null;

  return createPortal(
    <Modal open={open} onClose={onClose} title="Create material">
      <form action={action} className="space-y-6 px-6 py-6 sm:px-7">
        <MaterialFormFields allTags={allTags} />

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button className={button} disabled={pending}>
          {pending ? "Creating…" : "Create & attach"}
        </button>
      </form>
    </Modal>,
    document.body,
  );
}
