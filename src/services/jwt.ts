import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { JWTUser } from "../interfaces";

class JWTServices {
  public static async generateTokenForUser(user: User) {
    const payload: JWTUser = {
      id: user.id,
      email: user.email,
    };
    const secret = process.env.JWT_TOKEN_SECRET as string;
    const token = JWT.sign(payload, secret);

    return token;
  }

  public static decodeToken(token: string) {
    const secret = process.env.JWT_TOKEN_SECRET as string;
    return JWT.verify(token, secret) as JWTUser;
  }
}

export default JWTServices;
