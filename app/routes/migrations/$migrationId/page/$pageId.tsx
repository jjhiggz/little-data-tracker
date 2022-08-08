import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { prisma } from "~/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  console.log(params);
  console.log("fuck");
  const pageId = params.pageId;
  console.log(pageId);
  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
    },
  });
  return page;
};

const PageData = () => {
  const page = useLoaderData<typeof loader>();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      if (page?.responseContent) {
        containerRef.current.innerHTML = page?.responseContent;
      }
    }
  }, [containerRef, page?.responseContent]);

  return (
    <div className="h-full w-full text-white">
      <h1>{page?.title}</h1>
      <div ref={containerRef} className="flex flex-col items-center"></div>
    </div>
  );
};

export default PageData;
