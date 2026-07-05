import { prisma } from "@/lib/prisma"
import { PublicPayment } from "@/global"

export const createPayment = async (data: Omit<PublicPayment, 'paymentId'>): Promise<any> => {
  return await prisma.payment.create({
    data: {
      amount: data.amount,
      month: data.month,
      status: data.status || "PENDING",
      transactionId: data.transactionId || null,
      paymentMethod: data.paymentMethod || null,
      user: {
        connect: {
          userId: data.userId
        }
      },
      pg: {
        connect: {
          pgId: data.pgId
        }
      }
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      pg: {
        select: {
          title: true
        }
      }
    }
  });
};

export const getPaymentsByUserId = async (userId: string): Promise<any[]> => {
  return await prisma.payment.findMany({
    where: {
      userId
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      pg: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getPaymentsByPgId = async (pgId: string): Promise<any[]> => {
  return await prisma.payment.findMany({
    where: {
      pgId
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      pg: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: string,
  transactionId?: string | null,
  paymentMethod?: string | null
): Promise<any> => {
  return await prisma.payment.update({
    where: {
      paymentId
    },
    data: {
      status,
      ...(transactionId !== undefined && { transactionId }),
      ...(paymentMethod !== undefined && { paymentMethod })
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      pg: {
        select: {
          title: true
        }
      }
    }
  });
};
