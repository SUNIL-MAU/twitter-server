import { S3 } from "aws-sdk";
import { CreateTweetPayload, GraphqlContext } from "../../interfaces";
import { createTweet } from "../../services/tweet";

const s3Client = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_DEFAULT_REGION!,
  signatureVersion: "v4",
});

const queries = {
  getPresignedUrl: async (
    parent: any,
    { imageName, imageType }: { imageName: string; imageType: string },
    ctx: GraphqlContext
  ) => {
    try {
      if (!ctx.user?.id) throw new Error("Unautherized");
      const allowedImageTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (!allowedImageTypes.includes(imageType))
        throw new Error("Unsupported Image Type");

      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}`,
        Expires: 60,
        ContentType: imageType,
      };
      const url = s3Client.getSignedUrl("putObject", s3Params);
      return url;
    } catch (error: any) {
      console.log(error);
      throw new Error("Internal server error");
    }
  },
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    console.log({ payload });
    if (!ctx.user?.id) throw new Error("Unautherized");
    const newTweet = await createTweet({ ...payload, userId: ctx.user?.id });
    return newTweet;
  },
};

export const resolvers = { mutations, queries };
