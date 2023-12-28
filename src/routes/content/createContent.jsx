import { nanoid } from "nanoid/async";
import { Form, redirect } from "react-router-dom";
import { createOrUpdateFile } from "../../utils/handle-file";

export default function CreateContent() {
  return (
    <>
      <h1>Create new content</h1>
      <Form method="post" action="/content/create">
        <input type="text" name="title" />
        <button type="submit">Create</button>
      </Form>
    </>
  );
}

export async function createContentAction({ request }) {
  const data = await request.formData();
  const id = await nanoid();
  const title = data.get("title");

  const file = await createOrUpdateFile(id, title);

  if (file) {
    return redirect("/content");
  } else {
    return redirect("/content/create");
  }
}
