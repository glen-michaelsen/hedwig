"use client";

import {
  useActionState,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  chooseStudentAction,
  studentLoginAction,
  type StudentLoginState,
} from "../actions";
import { PhoneInput } from "../_components/phone-input";
import {
  Card,
  ErrorText,
  button,
  buttonGhost,
  input,
  label,
} from "../_components/ui";

/** Convenience only — nothing secret is kept here, and never the PIN. */
const SAVED_PHONE_KEY = "trenodo:phone";

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readSavedPhone(): string | null {
  try {
    return window.localStorage.getItem(SAVED_PHONE_KEY);
  } catch {
    // Private browsing, or storage disabled.
    return null;
  }
}

/** The page is prerendered, so the server never has a saved number. */
function readSavedPhoneOnServer(): string | null {
  return null;
}

export default function StudentLoginPage() {
  const [state, action, pending] = useActionState<StudentLoginState, FormData>(
    studentLoginAction,
    {},
  );
  const [chooseState, chooseAction, choosePending] = useActionState<
    StudentLoginState,
    FormData
  >(chooseStudentAction, {});

  const savedPhone = useSyncExternalStore(
    subscribeToStorage,
    readSavedPhone,
    readSavedPhoneOnServer,
  );

  const [phone, setPhone] = useState("");
  // Ticked by default when there's already a number saved, until the student
  // says otherwise.
  const [rememberChoice, setRememberChoice] = useState<boolean | null>(null);
  const remember = rememberChoice ?? savedPhone !== null;

  useEffect(() => {
    try {
      if (remember && phone) {
        window.localStorage.setItem(SAVED_PHONE_KEY, phone);
      } else if (!remember) {
        window.localStorage.removeItem(SAVED_PHONE_KEY);
      }
    } catch {
      // Ignore — remembering is a convenience, not a requirement.
    }
  }, [remember, phone]);

  // One phone number, several students on it — the PIN was already checked.
  if (state.candidates && state.token) {
    return (
      <Card raised>
        <h1 className="text-2xl font-semibold tracking-tight">
          Who&rsquo;s practising?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          This number covers more than one student.
        </p>

        <form action={chooseAction} className="mt-8 space-y-2.5">
          <input type="hidden" name="token" value={state.token} />
          {state.candidates.map((candidate) => (
            <button
              key={candidate.id}
              name="studentId"
              value={candidate.id}
              className={`${buttonGhost} w-full justify-start px-6 py-4 text-base`}
              disabled={choosePending}
            >
              {candidate.name}
            </button>
          ))}
        </form>

        {chooseState.error && (
          <div className="mt-5">
            <ErrorText>{chooseState.error}</ErrorText>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card raised>
      <h1 className="text-2xl font-semibold tracking-tight">Your lessons</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
        Sign in with your phone number and the PIN your teacher gave you.
      </p>

      <form action={action} className="mt-8 space-y-5">
        <div>
          <label className={label} htmlFor="phone">
            Phone number
          </label>
          <PhoneInput
            // Remounts once the saved number arrives from localStorage,
            // which the prerendered HTML can't contain.
            key={savedPhone ?? "empty"}
            id="phone"
            name="phone"
            defaultValue={savedPhone}
            onValueChange={setPhone}
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="pin">
            PIN
          </label>
          <input
            className={`${input} text-center font-mono text-2xl tracking-[0.4em]`}
            id="pin"
            name="pin"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            autoComplete="off"
            placeholder="••••"
            required
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-surface-muted px-4 py-3.5 text-sm text-muted transition-colors hover:text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-600"
            checked={remember}
            onChange={(event) => setRememberChoice(event.target.checked)}
          />
          Remember my phone number on this device
        </label>

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button className={`${button} w-full py-3.5 text-base`} disabled={pending}>
          {pending ? "Checking…" : "Open my lessons"}
        </button>
      </form>
    </Card>
  );
}
