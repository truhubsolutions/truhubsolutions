let last: unknown = null;

if (typeof process !== "undefined" && typeof process.on === "function") {
  try {
    process.on("uncaughtException", (e) => (last = e));
    process.on("unhandledRejection", (e) => (last = e));
  } catch {
    /* noop in worker */
  }
}

export function consumeLastCapturedError(): unknown {
  const e = last;
  last = null;
  return e;
}
