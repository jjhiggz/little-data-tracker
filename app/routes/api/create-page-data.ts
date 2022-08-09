import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";

export const action = async ({ request }: ActionArgs) => {
  const data = await request.json();
  console.log(data);
  const responseContent = data.responseContent;
  const migrationId = data.migrationId;
  const title = data.title;

  if (!responseContent) {
    return json({ error: "no responseContent key" }, 400);
  }
  if (!migrationId) {
    return json({ error: "no migrationId" }, 400);
  }
  if (!title) {
    return json({ error: "no title" }, 400);
  }

  const page = await prisma.page.create({
    data: {
      responseContent,
      title,
      migrationId,
    },
  });

  console.log(page);

  return json("success", {
    headers: { "Access-Control-Allow-Origin": "*" },
    status: 200,
  });
};
