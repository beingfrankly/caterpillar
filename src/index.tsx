import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import CreateContent, {
  createContentAction,
} from "./routes/content/createContent";
import ContentItem from "./routes/content/contentItem";
import ContentOverview from "./routes/content/contentOverview";
import ErrorPage from "./routes/error-page";
import Root from "./routes/root";
import { getAllContent, getContentItem } from "./utils/getContent";

export async function contentLoader() {
  const content = await getAllContent();
  return { content };
}

export async function contentItemLoader({ params }: { params: any }) {
  const contentItem = await getContentItem(params.contentId);
  return { contentItem };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "content",
        element: <ContentOverview />,
        loader: contentLoader,
      },
      {
        path: "content/:contentId",
        element: <ContentItem />,
        loader: contentItemLoader,
      },
      {
        path: "content/create",
        element: <CreateContent />,
        action: createContentAction,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
