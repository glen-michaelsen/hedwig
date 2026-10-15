"use client";

import { ErrorNotice, type ErrorBoundaryProps } from "./_components/error-notice";

export default function RootError(props: ErrorBoundaryProps) {
  return (
    <main className="flex flex-1 items-center px-6">
      <ErrorNotice {...props} />
    </main>
  );
}
