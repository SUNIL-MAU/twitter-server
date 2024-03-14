import { User } from "@prisma/client";
import JWT from "jsonwebtoken";

class JWTServices {
  public static async generateTokenForUser(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const secret = process.env.JWT_TOKEN_SECRET as string;
    const token = JWT.sign(payload, secret);

    return token;
  }
}

export default JWTServices;
