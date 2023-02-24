import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ContentOverview() {
  const [entries, setEntries] = useState<FileEntry[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const entries = await readDir("", {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
      setEntries(entries);
    })();

    return () => {};
  }, []);

  return (
    <>
      <h1>Content</h1>
      <ul>
        {entries &&
          entries.map((entry) => (
            <li key={entry.name}>
              <Link to="1">{entry.name}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}
