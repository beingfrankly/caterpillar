import {
  writeTextFile,
  BaseDirectory,
  readDir,
  FileEntry,
  readTextFile,
} from "@tauri-apps/api/fs";

export const CONTENT_DIR = "content";

export async function createFile(contentId: string, title: string) {
  const content = `---
id: ${contentId}
title: ${title}
---`;

  await writeTextFile(`${CONTENT_DIR}/${kebabCase(title)}.md`, content, {
    dir: BaseDirectory.AppConfig,
  });
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
