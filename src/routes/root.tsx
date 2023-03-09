import { Link, Outlet } from "react-router-dom";
import { initDatabase } from "../utils/db";

export default function Root() {
  initDatabase();

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
