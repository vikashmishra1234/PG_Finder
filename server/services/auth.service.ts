import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ActionResponse, CreateUserDTO, IUser, loginUserDTO } from "@/global";
import {
  createUser,
  getRoleByName,
  getUserByEmail,
} from "@/server/repository/auth.repository";
import { cookies } from "next/headers";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

type AuthUser = Omit<IUser, "password">;

export type JwtPayload = {
  userId: string;
  email: string;
  name: string;
  roles?: { roleId?: string; name: string }[];
  stayingInPgId?: string | null;
  roomNo?: string | null;
  bedNo?: string | null;
};

const getJwtSecret = (): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret is not configured.");
  }

  return JWT_SECRET;
};

export const registerUser = async (
  userData: CreateUserDTO,
): Promise<ActionResponse<AuthUser>> => {
  try {
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const roleName = userData.isPgOwner ? "Owner" : "User";
    const role = await getRoleByName(roleName);

    if (!role) {
      return {
        success: false,
        message: `Required role "${roleName}" is not configured.`,
      };
    }

    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const newUser = await createUser({
      ...userData,
      password: passwordHash,
      roleIds: [role.roleId!],
    });

    return {
      success: true,
      message: "User created successfully.",
      data: newUser,
    };
  } catch (error) {
    console.error("registerUser error:", error);
    return {
      success: false,
      message: "Failed to create user. Please try again later.",
    };
  }
};

export const authenticateUser = async (
  userData: loginUserDTO,
): Promise<ActionResponse<string>> => {
  try {
    const user = await getUserByEmail(userData.email);
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const matchesPassword = await bcrypt.compare(
      userData.password,
      user.password,
    );
    if (!matchesPassword) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const tokenPayload: JwtPayload = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      roles: user.roles,
      stayingInPgId: user.stayingInPgId,
      roomNo: user.roomNo,
      bedNo: user.bedNo,
    };

    const token = jwt.sign(tokenPayload, getJwtSecret(), {
      expiresIn: "7d",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      message: "Login successful.",
      data: token,
    };
  } catch (error) {
    console.error("authenticateUser error:", error);
    return {
      success: false,
      message: "Failed to sign in. Please try again later.",
    };
  }
};
