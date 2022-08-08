import { Migration } from "@prisma/client";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export const loader = async () => {
  const migrations = await prisma.migration.findMany();
  return migrations;
};

const SidebarItem: React.FC<{ migration: Migration; to: string }> = ({
  migration,
  to,
}) => (
  <Link to={to} className=" text-blue-600">
    <div className="py-5 px-5 text-xl hover:bg-blue-300">{migration.title}</div>
  </Link>
);

const Sidebar: React.FC<{ migrations: Migration[] }> = ({ migrations }) => {
  return (
    <div className="h-full w-1/5 bg-white text-black" id="sidebar">
      <div className="bg-orange-700 p-2 text-white">
        <h1 className="text-3xl">Migrations</h1>
      </div>
      {migrations.map((migration) => (
        <SidebarItem
          migration={migration}
          key={migration.id}
          to={`/migrations/${migration.id}`}
        />
      ))}
    </div>
  );
};

const MigrationsPage = () => {
  const migrations = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex h-full w-full flex-col bg-slate-700 text-white">
        <header className="h-20 w-full bg-black text-5xl text-white">
          Migration Data
        </header>
        <div id="sidebar-and-content-container" className="flex h-full">
          <Sidebar migrations={migrations} />
          <div id="content" className="flex-1 bg-blue-600 text-white">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default MigrationsPage;
