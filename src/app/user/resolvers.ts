import { OAuth2Client } from "google-auth-library";
import { db } from "../../client/db";

import JWTServices from "../../services/jwt";
import { GoogleTokenResult, GraphqlContext } from "../../interfaces";

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
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    try {
      const id = ctx.user?.id;
      if (!id) return null;
      const user = await db.user.findFirst({ where: { id } });
      return user;
    } catch (error: any) {
      throw new Error("Internal server error");
    }
  },
};

export const resolvers = {
  queries,
};
