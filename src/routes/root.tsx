import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/content">Content</Link>
          </li>
        </ul>
      </nav>
      <main id="main">
        <Outlet />
      </main>
    </>
  );
}
