import {
  writeTextFile,
  BaseDirectory,
  readDir,
  FileEntry,
  readTextFile,
} from "@tauri-apps/api/fs";
import { insertContentItem } from "./db";
import { buildContentItemIndex } from "./getContent";

export const CONTENT_DIR = "content";

export async function createFile(
  contentId: string,
  title: string
): Promise<boolean> {
  const content = `---
id: ${contentId}
title: ${title}
---`;

  try {
    const file = await readTextFile(`${CONTENT_DIR}/${kebabCase(title)}.md`, {
      dir: BaseDirectory.AppData,
    });

    // If file already exists, return false
    if (file) return false;
  } catch (e) {
    console.error(e);
  }

  await writeTextFile(`${CONTENT_DIR}/${kebabCase(title)}.md`, content, {
    dir: BaseDirectory.AppConfig,
  });

  const contentItemIndex = await buildContentItemIndex({
    name: `${kebabCase(title)}.md`,
    path: `${CONTENT_DIR}/${kebabCase(title)}.md`,
  });

  await insertContentItem(contentItemIndex);

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
