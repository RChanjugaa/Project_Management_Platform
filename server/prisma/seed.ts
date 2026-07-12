import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  { name: "ADMIN", description: "System administrator with user and access management permissions." },
  { name: "PROJECT_MANAGER", description: "Project manager with project and task coordination permissions." },
  { name: "TEAM_MEMBER", description: "Team member with assigned project and task update permissions." }
];

const accounts = [
  {
    role: "ADMIN",
    name: process.env.SEED_ADMIN_NAME,
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD
  },
  {
    role: "PROJECT_MANAGER",
    name: process.env.SEED_MANAGER_NAME,
    email: process.env.SEED_MANAGER_EMAIL,
    password: process.env.SEED_MANAGER_PASSWORD
  },
  {
    role: "TEAM_MEMBER",
    name: process.env.SEED_MEMBER_NAME,
    email: process.env.SEED_MEMBER_EMAIL,
    password: process.env.SEED_MEMBER_PASSWORD
  }
];

function requireValue(value: string | undefined, key: string) {
  if (!value || value.startsWith("replace-with")) {
    throw new Error(`Missing secure seed value for ${key}`);
  }
  return value;
}

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description, isSystem: true },
      create: { ...role, isSystem: true }
    });
  }

  for (const account of accounts) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: account.role } });
    const email = requireValue(account.email, `SEED_${account.role}_EMAIL`);
    const password = requireValue(account.password, `SEED_${account.role}_PASSWORD`);
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
      where: { email },
      update: {
        name: requireValue(account.name, `SEED_${account.role}_NAME`),
        roleId: role.id,
        passwordHash,
        status: "ACTIVE"
      },
      create: {
        name: requireValue(account.name, `SEED_${account.role}_NAME`),
        email,
        roleId: role.id,
        passwordHash,
        status: "ACTIVE"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
