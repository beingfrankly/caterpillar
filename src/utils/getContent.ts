import { FileEntry } from "@tauri-apps/api/fs";
import matter from "gray-matter";
import { upsertContentItem, selectContentItem, selectContentItems } from "./db";
import { getFile, getFiles } from "./handle-file";

// TODO: Replace this with a more future proof solution. Possibly switch react-scripts with vite.
window.Buffer = window.Buffer || require("buffer").Buffer;

export async function getAllContent(): Promise<ContentItemIndex[] | undefined> {
  const contentItemIndexArray = await selectContentItems();

  if (contentItemIndexArray && contentItemIndexArray.length <= 0) {
    const files = await getFiles();
    const content = await Promise.all(
      files.map((file) => buildContentItemIndex(file))
    );
    content.forEach((entry) => upsertContentItem(entry));
    return content;
  } else {
    return contentItemIndexArray;
  }
}

export async function getContentItem(
  contentId: string
): Promise<ContentItem | undefined> {
  const contentItem = await selectContentItem(contentId);
  return contentItem ? buildContentItem(contentItem) : undefined;
}

export async function buildContentItem(
  file: ContentItemIndex | FileEntry
): Promise<ContentItem> {
  const { path, name } = file;

  // TODO: Handle undefined name in a proper way
  const content = await getFile(name ?? "");
  const frontmatter = matter(content);

  return {
    id: frontmatter.data?.id,
    title: frontmatter.data?.title,
    path: path,
    content: frontmatter.content,
  } as ContentItem;
}

export async function buildContentItemIndex(
  file: ContentItemIndex | FileEntry
): Promise<ContentItemIndex> {
  const { path, name } = file;

  // TODO: Handle undefined name in a proper way
  const content = await getFile(name ?? "");
  const frontmatter = matter(content);

  return {
    id: frontmatter.data?.id,
    title: frontmatter.data?.title,
    path: path,
    name: name,
  } as ContentItemIndex;
}

export type ContentItem = {
  id: string;
  title: string;
  path: string;
  content: string;
};

export type ContentItemIndex = {
  id: string;
  title: string;
  path: string;
  name: string;
};
