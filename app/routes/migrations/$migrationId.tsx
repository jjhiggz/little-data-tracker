import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const migrationId = params.migrationId;
  return await prisma.migration.findFirst({
    where: {
      id: migrationId,
    },
    include: {
      pages: true,
    },
  });
};

const MigrationShowPage = () => {
  const migration = useLoaderData<typeof loader>();
  return (
    <div className="m-4 flex h-full w-full flex-col items-center bg-black p-5">
      <h3 className="mb-2 text-4xl">{migration?.title}</h3>
      <div className="h-20 w-full bg-white p-4 text-black">
        <h4>Page Explorer: </h4>
        <div className="flex flex-wrap">
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
