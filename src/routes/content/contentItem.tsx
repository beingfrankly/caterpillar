import { useLoaderData } from "react-router-dom";
import { contentItemLoader } from "../..";
import Editor from "../../components/Editor/Editor";

export default function ContentId() {
  const { contentItem } = useLoaderData() as Awaited<
    ReturnType<typeof contentItemLoader>
  >;

  const content = contentItem?.content ?? "# Hello World";

  return (
    <>
      <h1>{contentItem?.title}</h1>
      <Editor content={content} />
    </>
  );
}
