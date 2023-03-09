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
  return await db.select<MetaFileIndex[]>("SELECT * FROM content_index");
}

export async function getContentItem(contentId: string): Promise<MetaFile> {
  const db = await getDatabase();
  const metaFileIndex = await db.select<MetaFileIndex>(
    "SELECT * FROM content_index WHERE id = $contentId",
    [contentId]
  );
  return buildMetaFile(metaFileIndex);
}

async function buildMetaFile(file: MetaFileIndex): Promise<MetaFile> {
  const { path, fileName } = file;

  const content = await readTextFile(`${CONTENT_DIR}/${fileName}` ?? "", {
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
  fileName: string;
};
