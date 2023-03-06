import {
  BaseDirectory,
  FileEntry,
  readDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import matter from "gray-matter";

// TODO: Replace this with a more future proof solution. Possibly switch react-scripts with vite.
window.Buffer = window.Buffer || require("buffer").Buffer;

// TODO: Replace this with Tauri SQLite
export let storage: Map<string, MetaFile>;

export async function getAllContent(): Promise<MetaFile[]> {
  if (typeof storage === "undefined") {
    storage = new Map<string, MetaFile>();

    const files = await readDir("", {
      dir: BaseDirectory.AppData,
      recursive: true,
    });

    const content = await Promise.all(files.map((file) => buildMetaFile(file)));
    content.forEach((entry) => storage.set(entry.id, entry));
  }

  console.dir(storage);
  return Array.from(storage, ([_key, value]) => ({
    ...value,
  }));
}

export function getContentItem(contentId: string): MetaFile | undefined {
  const contentItem = storage.get(contentId);
  return contentItem;
}

async function buildMetaFile(file: FileEntry): Promise<MetaFile> {
  const { path, name } = file;
  const content = await readTextFile(name ?? "", {
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
