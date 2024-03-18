import { db } from "../client/db";
import { CreateTweetPayload } from "../interfaces";

export const createTweet = async (data: CreateTweetPayload) => {
  try {
    const tweet = await db.tweet.create({
      data: {
        content: data.content,
        imagesUrl: data.imageURL,
        author: { connect: { id: data.userId } },
      },
    });
    return tweet;
  } catch (error) {
    throw new Error("Internal server error");
  }
};
