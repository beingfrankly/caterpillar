import {
  BaseDirectory,
  FileEntry,
  readDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import matter from "gray-matter";
import { getDatabase } from "./db";

// TODO: Replace this with a more future proof solution. Possibly switch react-scripts with vite.
window.Buffer = window.Buffer || require("buffer").Buffer;

export const CONTENT_DIR = "content";

export async function getAllContent(): Promise<MetaFileIndex[]> {
  const db = await getDatabase();
  const result = await db.select<MetaFileIndex[]>(
    "SELECT * FROM content_index"
  );

  if (result.length <= 0) {
    const files = await readDir("content", {
      dir: BaseDirectory.AppData,
      recursive: true,
    });

    const content = await Promise.all(
      files.map((file) => buildMetaFileIndex(file))
    );
    content.forEach((entry) => addContentItem(entry));
    return content;
  } else {
    return result;
  }
}

export async function getContentItem(contentId: string): Promise<MetaFile> {
  const db = await getDatabase();
  const metaFileIndex = await db.select<MetaFileIndex>(
    "SELECT * FROM content_index WHERE id = $1",
    [contentId]
  );
  return buildMetaFile(metaFileIndex);
}

export async function addContentItem(content: MetaFileIndex) {
  const { id, path, name, title } = content;
  const db = await getDatabase();
  return await db.execute(
    "INSERT INTO content_index (id, path, name, title) VALUES ($1, $2, $3, $4)",
    [id, path, name, title]
  );
}

async function buildMetaFile(
  file: MetaFileIndex | FileEntry
): Promise<MetaFile> {
  const { path, name } = file;

  const content = await readTextFile(`${CONTENT_DIR}/${name}` ?? "", {
    dir: BaseDirectory.AppData,
  });
  const frontmatter = matter(content);

  return {
    id: frontmatter.data?.id,
    title: frontmatter.data?.title,
    path: path,
    content: frontmatter.content,
  } as MetaFile;
}

async function buildMetaFileIndex(
  file: MetaFileIndex | FileEntry
): Promise<MetaFileIndex> {
  const { path, name } = file;

  const content = await readTextFile(`${CONTENT_DIR}/${name}` ?? "", {
    dir: BaseDirectory.AppData,
  });
  const frontmatter = matter(content);

  return {
    id: frontmatter.data?.id,
    title: frontmatter.data?.title,
    path: path,
    name: name,
  } as MetaFileIndex;
}

export type MetaFile = {
  id: string;
  title: string;
  path: string;
  content: string;
};

export type MetaFileIndex = {
  id: string;
  title: string;
  path: string;
  name: string;
};
