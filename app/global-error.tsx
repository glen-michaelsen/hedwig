"use client";

import "./globals.css";
import { ErrorNotice, type ErrorBoundaryProps } from "./_components/error-notice";

/** Only when the root layout itself fails. It replaces that layout, so it brings its own document. */
export default function GlobalError(props: ErrorBoundaryProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <title>Trenodo</title>
        <main className="flex flex-1 items-center px-6">
          <ErrorNotice {...props} />
        </main>
      </body>
    </html>
  );
}
