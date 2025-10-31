const level = process.env.LOG_LEVEL || "info";

function log(lvl: string, msg: string, meta?: unknown) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${lvl.toUpperCase()}] ${msg}`;
  if (meta) {
    // imprime objeto si hay
    console.log(base, meta);
  } else {
    console.log(base);
  }
}

export const logger = {
  info: (msg: string, meta?: unknown) => {
    if (["info", "debug"].includes(level)) log("info", msg, meta);
  },
  debug: (msg: string, meta?: unknown) => {
    if (["debug"].includes(level)) log("debug", msg, meta);
  },
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};
