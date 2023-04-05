import { Link, useLoaderData } from "react-router-dom";
import { contentLoader } from "../..";

export default function ContentOverview() {
  const { content } = useLoaderData() as Awaited<
    ReturnType<typeof contentLoader>
  >;

  return (
    <>
      <h1>Content</h1>
      <table>
        <caption>Content</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {content &&
            content.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.title}</td>
                <td>
                  <Link to={entry.id}>View</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Link to="create">Create new content</Link>
    </>
  );
}
