"use server";

import { redirect } from "next/navigation";
import {
  chooseStudent,
  loginStudent,
  logoutStudent,
  type Candidate,
} from "@/lib/student-session";

export type StudentLoginState = {
  error?: string;
  /** Set when the PIN matched several students on one number. */
  candidates?: Candidate[];
  token?: string;
};

/**
 * Phone + PIN sign-in. "No such number" and "wrong PIN" deliberately return
 * the same message, so the form can't be used to find out which numbers are
 * registered.
 *
 * TODO: front this with Turnstile before real students use it. The identifier
 * is a phone number now, so the PIN is the only secret and the per-number
 * lockout is the only thing rate-limiting a guess.
 */
export async function studentLoginAction(
  _prev: StudentLoginState,
  formData: FormData,
): Promise<StudentLoginState> {
  const phone = String(formData.get("phone") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (!phone || !pin) return { error: "Enter your phone number and PIN" };

  const result = await loginStudent(phone, pin);

  switch (result.status) {
    case "ok":
      break;
    case "choose":
      return { candidates: result.candidates, token: result.token };
    case "locked":
      return {
        error: `Too many tries. Try again in ${result.retryInMinutes} minutes.`,
      };
    case "invalid":
      return { error: "That phone number and PIN don't match." };
  }

  redirect("/s");
}

/** Second step when one number covers more than one student. */
export async function chooseStudentAction(
  _prev: StudentLoginState,
  formData: FormData,
): Promise<StudentLoginState> {
  const token = String(formData.get("token") ?? "");
  const studentId = String(formData.get("studentId") ?? "");

  const ok = await chooseStudent(token, studentId);
  if (!ok) return { error: "That took too long — please sign in again." };

  redirect("/s");
}

export async function studentLogoutAction() {
  await logoutStudent();
  redirect("/login");
}
