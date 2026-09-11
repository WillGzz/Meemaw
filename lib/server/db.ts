import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

let instance: Database.Database | undefined;
export function db() {
  if (!instance) {
    const path = process.env.DATABASE_PATH || resolve(process.cwd(), "data/meemaw.sqlite");
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    instance = new Database(path);
    instance.pragma("journal_mode = WAL");
    instance.pragma("foreign_keys = ON");
    instance.exec(readFileSync(resolve(process.cwd(), "db/schema.sql"), "utf8"));
  }
  return instance;
}
