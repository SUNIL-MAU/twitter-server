import { OAuth2Client } from "google-auth-library";
import { db } from "../../client/db";
import { GoogleTokenResult } from "../../global/types";
import JWTServices from "../../services/jwt";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: String }) => {
    try {
      const googleToken = token as string;
      const clientId = process.env.GOOGOLE_CLIENT_ID;
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: clientId,
      });
      const data = ticket.getPayload() as GoogleTokenResult;
      const user = await db.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        await db.user.create({
          data: {
            firstName: data.given_name,
            lastName: data.family_name,
            email: data.email,
            profileImageUrl: data.picture,
          },
        });
      }

      const isUserExist = await db.user.findFirst({
        where: { email: data.email },
      });

      if (!isUserExist) {
        throw new Error("User with email not found!");
      }

      const jwtToken = JWTServices.generateTokenForUser(isUserExist);

      return jwtToken;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};

export const resolvers = {
  queries,
};
