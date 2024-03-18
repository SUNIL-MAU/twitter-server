export interface GoogleTokenResult {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface JWTUser {
  id: string;
  email: string;
}

export interface GraphqlContext {
  user?: JWTUser;
}

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}
