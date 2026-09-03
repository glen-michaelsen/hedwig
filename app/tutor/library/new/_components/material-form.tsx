"use client";

import { useActionState } from "react";
import { createMaterialAction, type NewMaterialState } from "../../../actions";
import { MaterialFormFields } from "../../../_components/material-form-fields";
import { Card, ErrorText, button } from "@/app/_components/ui";

export function MaterialForm({ allTags }: { allTags: string[] }) {
  const [state, action, pending] = useActionState<NewMaterialState, FormData>(
    createMaterialAction,
    {},
  );

  return (
    <Card>
      <form action={action} className="space-y-6">
        <MaterialFormFields allTags={allTags} />

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button className={button} disabled={pending}>
          {pending ? "Saving…" : "Add to library"}
        </button>
      </form>
    </Card>
  );
}
