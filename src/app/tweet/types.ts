export const types = `#graphql

    input CreateTweetData {
        content: String!
        imageURL: String
    }

    type tweet {
        id:ID!
        content:String!
        imageUrl:String
        author:User
    }
`;
