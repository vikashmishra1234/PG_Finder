"use server";

import { ActionResponse, PublicPg } from "@/global";

import {
  createPg,
  updatePg,
  deletePgById,
  getPgById,
  getAllPg,
} from "@/server/repository/pg.repository";

export const createPgAction = async (
  pgData: PublicPg,
  userId:string
): Promise<ActionResponse<PublicPg>> => {

  try {
    const result = await createPg(pgData,userId);

    return {
      success: true,
      data: result,
      message: "PG created successfully",
    };

  } catch (error) {

    return {
      success: false,
      message: "Error while creating PG",
    };
  }
};

export const updatePgAction = async (
  pgId: string,
  pgData: PublicPg
): Promise<ActionResponse<PublicPg>> => {

  try {

    const result = await updatePg(pgData, pgId);

    return {
      success: true,
      data: result,
      message: "PG updated successfully",
    };

  } catch (error) {

    return {
      success: false,
      message: "Error while updating PG",
    };
  }
};

export const deletePgAction = async (
  pgId: string
): Promise<ActionResponse<null>> => {

  try {

    await deletePgById(pgId);

    return {
      success: true,
      message: "PG deleted successfully",
    };

  } catch (error) {

    return {
      success: false,
      message: "Error while deleting PG",
    };
  }
};

export const getPgByIdAction = async (
  pgId: string
): Promise<ActionResponse<PublicPg>> => {

  try {

    const result = await getPgById(pgId);

    if (!result) {
      return {
        success: false,
        message: "PG not found",
      };
    }

    return {
      success: true,
      data: result,
      message: "PG fetched successfully",
    };

  } catch (error) {

    return {
      success: false,
      message: "Error while fetching PG",
    };
  }
};

export const getAllPgAction = async (): Promise<
  ActionResponse<PublicPg[]>
> => {

  try {

    const result = await getAllPg();

    return {
      success: true,
      data: result,
      message: "PGs fetched successfully",
    };

  } catch (error) {

    return {
      success: false,
      message: "Error while fetching PGs",
    };
  }
};