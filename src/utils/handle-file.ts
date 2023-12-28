import {
  writeTextFile,
  BaseDirectory,
  readDir,
  FileEntry,
  readTextFile,
} from "@tauri-apps/api/fs";
import { upsertContentItem } from "./db";
import { buildContentItemIndex } from "./getContent";

export const CONTENT_DIR = "content";

export async function createOrUpdateFile(
  contentId: string,
  title: string,
  content?: string
): Promise<boolean> {
  const fileContent = `---
id: ${contentId}
title: ${title}
---
${content || ""}`;

  const fileName = `${kebabCase(title)}.md`;

  try {
    const file = await readTextFile(`${CONTENT_DIR}/${fileName}.md`, {
      dir: BaseDirectory.AppData,
    });

    // If file already exists, return false
    if (file) return false;
  } catch (e) {
    console.error(e);
  }

  await writeTextFile(`${CONTENT_DIR}/${fileName}.md`, fileContent, {
    dir: BaseDirectory.AppConfig,
  });

  const contentItemIndex = await buildContentItemIndex({
    name: fileName,
    path: `${CONTENT_DIR}/${fileName}.md`,
  });

  await upsertContentItem(contentItemIndex);

  return true;
}

export async function getFile(name: string): Promise<string> {
  return readTextFile(`${CONTENT_DIR}/${name}`, {
    dir: BaseDirectory.AppData,
  });
}

export async function getFiles(): Promise<FileEntry[]> {
  const files = await readDir(CONTENT_DIR, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  return files.filter((file) => file?.name?.endsWith(".md"));
}

export function kebabCase(string: string) {
  return string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
