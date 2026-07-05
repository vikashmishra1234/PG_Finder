"use server";

import { ActionResponse } from "@/global";
import { revalidatePath } from "next/cache";
import {
  createComplaint,
  getComplaintsByUserId,
  getComplaintsByPgId,
  updateComplaintStatus,
} from "@/server/repository/complaint.repository";

export const createComplaintAction = async (data: {
  userId: string;
  pgId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
}): Promise<ActionResponse<any>> => {
  try {
    const result = await createComplaint({ ...data, status: "PENDING" });
    revalidatePath("/dashboard/residency/compliants");
    revalidatePath("/dashboard/owner/complaints");
    return {
      success: true,
      data: result,
      message: "Complaint submitted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to submit complaint",
    };
  }
};

export const getComplaintsByUserIdAction = async (
  userId: string
): Promise<ActionResponse<any[]>> => {
  try {
    const result = await getComplaintsByUserId(userId);
    return {
      success: true,
      data: result,
      message: "Complaints fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch complaints",
    };
  }
};

export const getComplaintsByPgIdAction = async (
  pgId: string
): Promise<ActionResponse<any[]>> => {
  try {
    const result = await getComplaintsByPgId(pgId);
    return {
      success: true,
      data: result,
      message: "Complaints fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch complaints",
    };
  }
};

export const updateComplaintStatusAction = async (
  complaintId: string,
  status: string
): Promise<ActionResponse<any>> => {
  try {
    const result = await updateComplaintStatus(complaintId, status);
    revalidatePath("/dashboard/residency/compliants");
    revalidatePath("/dashboard/owner/complaints");
    return {
      success: true,
      data: result,
      message: "Complaint status updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update complaint status",
    };
  }
};
