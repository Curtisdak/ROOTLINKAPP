import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

export async function handleJWT({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
  if (user) {
    token.id = user.id;
    token.email = user.email ?? "";
    token.role = user.role ?? "USER";
  }
  return token;
}

export async function handleSession({ session, token }: { session: Session; token: JWT }): Promise<Session> {
  session.user.id = token.id ?? "";
  session.user.email = token.email ?? "";
  session.user.role = token.role ?? "USER";
  return session;
}
