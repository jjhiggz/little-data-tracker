import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
};

const clear = async () => {
  await prisma.user.deleteMany();
  await prisma.migration.deleteMany();
  await prisma.page.deleteMany();
};

async function seed() {
  await clear();
  await createUser({
    email: "jonathan.higger@bombbomb.com",
    password: "password9000",
  });

  const listUploadFailures = await prisma.migration.create({
    data: {
      title: "List Upload Migration",
      description:
        "Migrating from Oracle to Postgres means that we can't have any more CLOB / NCLOB columns. Currently in the ListUpload table, we are storing `failure_info` as a big json string in NCLOB format, we need to move it to S3",
    },
  });

  const fakePage1 = await prisma.page.create({
    data: {
      title: "1",
      responseContent: `<br>Starting List Id: 0b400b85-8ff4-e287-93da-01d304f7d3de<br>Ending List Id: df0e9f09-da5e-d4df-41e9-c1edb2b22c01<br>Affected: 0<br>Count: 800<br><br><br><br><h1>GREAT SUCCESS</h1><h1><img width="400px" height="200px" src="https://ih1.redbubble.net/image.3648358316.1824/st,small,507x507-pad,600x600,f8f8f8.jpg"> </h1>`,
      migrationId: listUploadFailures.id,
    },
  });

  const fakePage2 = await prisma.page.create({
    data: {
      title: "1",
      responseContent: `<br>Starting List Id: dlakjsfjlsdkfjlksdj-8ff4-e287-93da-01d304f7d3de<br>Ending List Id: sldkfjslkdjf-da5e-d4df-41e9-c1edb2b22c01<br>Affected: 0<br>Count: 800<br><br><br><br><h1>GREAT SUCCESS</h1><h1><img width="400px" height="200px" src="https://ih1.redbubble.net/image.3648358316.1824/st,small,507x507-pad,600x600,f8f8f8.jpg"> yiipeee</h1>`,
      migrationId: listUploadFailures.id,
    },
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
