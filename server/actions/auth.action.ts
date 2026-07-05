"use server";

import { ActionResponse, CreateUserDTO, IUser, loginUserDTO } from "@/global";
import {
  authenticateUser,
  registerUser,
} from "@/server/services/auth.service";

export const signUpUserAction = async (
  userData: CreateUserDTO
): Promise<ActionResponse<Omit<IUser, "password">>> => {
  return registerUser(userData);
};

export const loginUserAction = async (
  userData: loginUserDTO
): Promise<ActionResponse<string>> => {
  return authenticateUser(userData);
};

export const logoutUserAction = async (): Promise<ActionResponse<null>> => {
  const cookieStore = await (await import("next/headers")).cookies();
  cookieStore.delete("token");
  return {
    success: true,
    message: "Logged out successfully",
  };
};
