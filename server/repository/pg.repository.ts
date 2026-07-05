import { prisma } from "@/lib/prisma"
import {PublicPg} from "@/global"

export const createPg = async (
  data: PublicPg,
  userId:string
): Promise<PublicPg> => {

  const newPg = await prisma.pG.create({
    data: {
      ...data,

      user: {
        connect: {
          userId: userId,
        },
      },
    },
  });

  return newPg;
};

export const updatePg = async (
  data: PublicPg,
  pgId: string
): Promise<PublicPg> => {

  const updatedPg = await prisma.pG.update({
    where: {
      pgId,
    },
    data,
  });

  return updatedPg;
};

export const deletePgById = async (
  pgId: string
): Promise<boolean> => {

    await prisma.pG.delete({
        where:{
            pgId
        }
    })
    return true;
};

export const getPgById = async (
  pgId: string
): Promise<PublicPg|null> => {

    const pg = await prisma.pG.findFirst({where:{pgId}});
    return pg;
};

export const getAllPg = async (): Promise<PublicPg[]> => {

  const pgs = await prisma.pG.findMany({
    where: {
      isActive: true,
      isDeleted: false,
    },
  });

  return pgs;
};


