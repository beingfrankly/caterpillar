import Database, { QueryResult } from "tauri-plugin-sql-api";
import { ContentItemIndex } from "./getContent";

export async function getDatabase(): Promise<Database> {
  return await Database.load("sqlite:index.db");
}

// TODO: This needs to run only once when the app starts & check if the table already exists. For now it runs every time. This should be extracted to Rust.
export async function initDatabase() {
  const db = await getDatabase();
  try {
    const result = await db.execute(
      "CREATE TABLE content_index (id TEXT PRIMARY KEY UNIQUE, title TEXT, path TEXT, name TEXT)"
    );
    db.close();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function selectContentItem(
  id: string
): Promise<ContentItemIndex | undefined> {
  try {
    const db = await getDatabase();
    // The db.select returns an array, but we're only expecting one result. Considering the id is unique, we can just return the first result. For now.
    const result = await db.select<ContentItemIndex[]>(
      "SELECT * FROM content_index WHERE id = $1",
      [id]
    );
    db.close();
    return result[0];
  } catch (error) {
    console.error(error);
  }
}

export async function selectContentItems(): Promise<
  ContentItemIndex[] | undefined
> {
  try {
    const db = await getDatabase();
    const result = await db.select<ContentItemIndex[]>(
      "SELECT * FROM content_index"
    );
    db.close();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function insertContentItem(
  contentItemIndex: ContentItemIndex
): Promise<QueryResult | undefined> {
  try {
    const { id, path, name, title } = contentItemIndex;
    const db = await getDatabase();
    const result = await db.execute(
      "INSERT INTO content_index (id, path, name, title) VALUES ($1, $2, $3, $4)",
      [id, path, name, title]
    );
    db.close();
    return result;
  } catch (error) {
    console.error(error);
  }
}
