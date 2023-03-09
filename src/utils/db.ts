import Database from "tauri-plugin-sql-api";

export async function getDatabase(): Promise<Database> {
  return await Database.load("sqlite:index.db");
}

// TODO: This needs to run only once when the app starts & check if the table already exists
export async function initDatabase() {
  const db = await getDatabase();
  return await db.execute(
    "CREATE TABLE content_index (id TEXT PRIMARY KEY UNIQUE, title TEXT, path TEXT, name TEXT)"
  );
}
