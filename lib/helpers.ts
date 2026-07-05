import { cookies } from "next/headers";
import  jwt  from "jsonwebtoken";
import { JwtPayload } from "@/server/services/auth.service";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const secret = process.env.JWT_SECRET

  if (!token||!secret) return null;

  try {
    const payload = jwt.verify(token,secret) as JwtPayload

    return payload;
  } catch {
    return null;
  }
}