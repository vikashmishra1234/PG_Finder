import { prisma } from "@/lib/prisma"
import { PublicComplaint } from "@/global"

export const createComplaint = async (data: Omit<PublicComplaint, 'complaintId'>): Promise<any> => {
  return await prisma.complaint.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: data.status || "PENDING",
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

export const getComplaintsByUserId = async (userId: string): Promise<any[]> => {
  return await prisma.complaint.findMany({
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

export const getComplaintsByPgId = async (pgId: string): Promise<any[]> => {
  return await prisma.complaint.findMany({
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

export const updateComplaintStatus = async (complaintId: string, status: string): Promise<any> => {
  return await prisma.complaint.update({
    where: {
      complaintId
    },
    data: {
      status
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
