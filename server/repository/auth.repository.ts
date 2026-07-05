import { CreateUserDTO, IRole, IUser } from "@/global";
import { prisma } from "@/lib/prisma";

export const createUser = async (
  userData: CreateUserDTO
): Promise<Omit<IUser, "password">> => {
  const { name, email, password, roleIds } = userData;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      roles: roleIds?.length
        ? {
            connect: roleIds.map((roleId) => ({ roleId })),
          }
        : undefined,
    },
    select: {
      userId: true,
      name: true,
      email: true,
      isDeleted: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      roles: true,
      pgId: true,
    },
  });

  return user;
};

export const getUserByEmail = async (
  email: string
): Promise<IUser | null> => {
  return prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });
};

export const getRoleByName = async (
  roleName: string
): Promise<IRole | null> => {
  return prisma.role.findUnique({
    where: { name: roleName },
  });
};

export const getAllRoles = async (): Promise<IRole[]> => {
  return prisma.role.findMany();
};

