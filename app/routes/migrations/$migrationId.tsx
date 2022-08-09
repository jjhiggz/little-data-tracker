import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { useRef } from "react";
import { prisma } from "~/db.server";
import useKeyListener from "~/hooks/useKeyListener";

export const loader = async ({ params }: LoaderArgs) => {
  const migrationId = params.migrationId;
  return await prisma.migration.findFirst({
    where: {
      id: migrationId,
    },
    include: {
      pages: {
        orderBy: {
          title: "asc",
        },
      },
    },
  });
};

const MigrationShowPage = () => {
  const migration = useLoaderData<typeof loader>();
  const location = useLocation();
  const nextLinkRef = useRef<HTMLAnchorElement>(null);
  const prevLinkRef = useRef<HTMLAnchorElement>(null);

  const getCurrentPageIndex = (pageId: string) => {
    return migration
      ? migration.pages.findIndex((page) => page.id === pageId)
      : null;
  };

  const pageId = (() => {
    if (!location.pathname.includes("page")) {
      return null;
    }
    return location.pathname.split("/").pop();
  })();

  const nextPageId = (() => {
    return migration?.pages[getCurrentPageIndex(pageId!)! + 1]?.id;
  })();
  const previousPageId = (() => {
    return migration?.pages[getCurrentPageIndex(pageId!)! - 1]?.id;
  })();

  useKeyListener({
    keys: ["l", "ArrowRight"],
    onKey: "down",
    handler: () => {
      if (nextPageId && nextLinkRef.current) {
        nextLinkRef.current.click();
      }
    },
    activeWhen: true,
  });

  useKeyListener({
    keys: ["h", "ArrowLeft"],
    onKey: "down",
    handler: () => {
      if (previousPageId && prevLinkRef.current) {
        prevLinkRef.current.click();
      }
    },
    activeWhen: true,
  });

  return (
    <div className="m-4 flex h-full w-full flex-col items-center bg-black p-5">
      <div className="flex justify-evenly">
        <Link
          to={`/migrations/${migration!.id}/page/${previousPageId}`}
          ref={prevLinkRef}
        >
          Prev
        </Link>
        <h3 className="mb-2 text-4xl">{migration?.title}</h3>
        <Link
          to={`/migrations/${migration!.id}/page/${nextPageId}`}
          ref={nextLinkRef}
        >
          Prev
        </Link>
      </div>
      <div className="h-20 w-full overflow-scroll bg-white p-4 text-black">
        <h4>Page Explorer: </h4>
        <div className="flex flex-wrap overflow-scroll">
          {migration?.pages.map((page) => (
            <Link to={`page/${page.id}`} key={page.id}>
              <div className="px-2 text-blue-500 underline">{page.title}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-full w-full flex-1 bg-gray-700 text-white">
        <Outlet />
      </div>
    </div>
  );
};

export default MigrationShowPage;
