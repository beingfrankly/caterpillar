import { useState } from "react";
import { redirect, useLoaderData, useParams } from "react-router-dom";
import { contentItemLoader } from "../..";
import Editor from "../../components/Editor/Editor";
import { createOrUpdateFile } from "../../utils/handle-file";

export default function ContentId() {
  const { contentItem } = useLoaderData() as Awaited<
    ReturnType<typeof contentItemLoader>
  >;
  const { contentId } = useParams();

  const content = contentItem?.content || "Hi";

  function useHandleSave(content: string) {
    console.log({ content });
    console.log({ contentId });
    if (contentId === undefined) {
      throw new Error("contentId is undefined");
    }
    createOrUpdateFile(contentId, contentItem?.title, content);
  }

  return (
    <>
      <h1>{contentItem?.title}</h1>
      <Editor content={content} saveCallback={useHandleSave} />
    </>
  );
}

export async function updateContentAction({
  params,
  request,
}: {
  params: any;
  request: any;
}) {
  const contentId = params.id;
  const data = await request.formData();
  const title = data.get("title");
  const content = data.get("content");

  await createOrUpdateFile(contentId, title, content);

  return redirect(`/content/${contentId}`);
}
