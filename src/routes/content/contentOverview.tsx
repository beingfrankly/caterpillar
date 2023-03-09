import { Link, useLoaderData } from "react-router-dom";
import { contentLoader } from "../..";

export default function ContentOverview() {
  const { content } = useLoaderData() as Awaited<
    ReturnType<typeof contentLoader>
  >;

  return (
    <>
      <h1>Content</h1>
      <ul>
        {content &&
          content.map((entry) => (
            <li key={entry.id}>
              <Link to={entry.id}>{entry.title}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}
