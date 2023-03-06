import { useLoaderData } from "react-router-dom";
import { contentItemLoader } from "../..";

export default function ContentId() {
  const { contentItem } = useLoaderData() as Awaited<
    ReturnType<typeof contentItemLoader>
  >;

  return (
    <>
      <h1>{ contentItem?.title }</h1>
    </>
  );
}
