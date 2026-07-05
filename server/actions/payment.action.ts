"use server";

import { ActionResponse } from "@/global";
import { revalidatePath } from "next/cache";
import {
  createPayment,
  getPaymentsByUserId,
  getPaymentsByPgId,
  updatePaymentStatus,
} from "@/server/repository/payment.repository";

export const createPaymentAction = async (data: {
  userId: string;
  pgId: string;
  amount: number;
  month: string;
  status: string;
  transactionId?: string | null;
  paymentMethod?: string | null;
}): Promise<ActionResponse<any>> => {
  try {
    const result = await createPayment(data);
    revalidatePath("/dashboard/residency/payments");
    revalidatePath("/dashboard/owner/payments");
    return {
      success: true,
      data: result,
      message: "Payment logged successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to log payment",
    };
  }
};

export const getPaymentsByUserIdAction = async (
  userId: string
): Promise<ActionResponse<any[]>> => {
  try {
    const result = await getPaymentsByUserId(userId);
    return {
      success: true,
      data: result,
      message: "Payments fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch payments",
    };
  }
};

export const getPaymentsByPgIdAction = async (
  pgId: string
): Promise<ActionResponse<any[]>> => {
  try {
    const result = await getPaymentsByPgId(pgId);
    return {
      success: true,
      data: result,
      message: "Payments fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch payments",
    };
  }
};

export const updatePaymentStatusAction = async (
  paymentId: string,
  status: string,
  transactionId?: string | null,
  paymentMethod?: string | null
): Promise<ActionResponse<any>> => {
  try {
    const result = await updatePaymentStatus(paymentId, status, transactionId, paymentMethod);
    revalidatePath("/dashboard/residency/payments");
    revalidatePath("/dashboard/owner/payments");
    return {
      success: true,
      data: result,
      message: "Payment status updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update payment status",
    };
  }
};
