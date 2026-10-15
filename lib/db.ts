import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export async function getEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

export async function getDb() {
  const env = await getEnv();
  return drizzle(steadyD1(env.DB), { schema });
}

export type Db = Awaited<ReturnType<typeof getDb>>;

/*
 * Inside D1 our queries take a few milliseconds. The trip there doesn't
 * always: now and then a call hangs for 8 to 12 seconds and then fails,
 * which reaches the visitor as "This page couldn't load". Sending the same
 * read again gets through at once.
 *
 * So reads get a deadline and a second try. Writes don't: a write that
 * timed out may still have landed, and running it twice is worse than
 * failing once.
 */

/** Deadline for each attempt at a read. Queries take milliseconds, so this is only ever hit by a stall. */
const READ_ATTEMPTS_MS = [2500, 5000];

/** Errors D1 documents as safe to retry, plus our own deadline. */
const TRANSIENT =
  /timed out|network connection lost|internal error|object to be reset|reset because|overloaded|temporarily unavailable/i;

class D1Timeout extends Error {
  constructor(ms: number) {
    super(`D1 read timed out after ${ms}ms`);
  }
}

function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new D1Timeout(ms)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function isRead(sql: string) {
  return /^\s*(select|pragma)\b/i.test(sql);
}

async function steadyRead<T>(sql: string, run: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await withDeadline(run(), READ_ATTEMPTS_MS[attempt]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const last = attempt === READ_ATTEMPTS_MS.length - 1;
      if (last || !TRANSIENT.test(message)) throw error;
      console.warn(`D1 read retried (${message}): ${sql.slice(0, 120)}`);
    }
  }
}

/** The real statement behind a wrapped one, for `batch`, which only takes the binding's own. */
const unwrapped = new WeakMap<object, D1PreparedStatement>();

function steadyStatement(sql: string, stmt: D1PreparedStatement): D1PreparedStatement {
  const wrapped = new Proxy(stmt, {
    get(target, prop) {
      if (prop === "bind") {
        return (...values: unknown[]) => steadyStatement(sql, target.bind(...values));
      }
      if (prop === "all" || prop === "raw" || prop === "first") {
        const method = (target[prop] as (...args: unknown[]) => Promise<unknown>).bind(target);
        return (...args: unknown[]) => steadyRead(sql, () => method(...args));
      }
      const value = Reflect.get(target, prop, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
  unwrapped.set(wrapped, stmt);
  return wrapped;
}

/** The D1 binding, with a deadline and one retry on reads. */
export function steadyD1(db: D1Database): D1Database {
  return new Proxy(db, {
    get(target, prop) {
      if (prop === "prepare") {
        return (sql: string) => {
          const stmt = target.prepare(sql);
          return isRead(sql) ? steadyStatement(sql, stmt) : stmt;
        };
      }
      if (prop === "batch") {
        return (statements: D1PreparedStatement[]) =>
          target.batch(statements.map((stmt) => unwrapped.get(stmt) ?? stmt));
      }
      const value = Reflect.get(target, prop, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
