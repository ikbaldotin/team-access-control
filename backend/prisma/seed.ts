import { prisma } from "../src/lib/prisma";

const roles = [
  { code: "OWNER", description: "Organization owner" },
  { code: "ADMIN", description: "Organization administrator" },
  {
    code: "MEMBER",
    description: "Organization member",
  },
];

const permissions = [
  {
    code: "organization:read",
    description: "Read organization data",
  },
  {
    code: "organization:update",
    description: "Update organization",
  },
  {
    code: "organization:delete",
    description: "Soft-delete organization",
  },
  {
    code: "members:invite",
    description: "Invite members",
  },
  {
    code: "members:remove",
    description: "Remove eligible members",
  },
  {
    code: "projects:read",
    description: "Read projects",
  },
  {
    code: "members:role-update",
    description: "Update member roles",
  },
  {
    code: "members:reactivate",
    description: "Reactivate suspended members",
  },
];

const rolePermissions: Record<string, string[]> = {
  OWNER: permissions.map((permission) => permission.code),
  ADMIN: [
    "organization:read",
    "members:invite",
    "members:remove",
    "organization:read",
  ],
  MEMBER: ["organization:read", "organization:read"],
};

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        code: role.code,
      },
      update: { description: role.description },
      create: role,
    });
  }
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: { description: permission.description },
      create: permission,
    });
  }
  for (const [roleId, permissionCodes] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: {
        code: roleId,
      },
    });
    for (const permissionCode of permissionCodes) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: {
          code: permissionCode,
        },
      });
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed roles and permissions:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
