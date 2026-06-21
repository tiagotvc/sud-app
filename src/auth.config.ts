import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role as string | undefined;

      if (pathname.startsWith("/bispado")) {
        if (!isLoggedIn) {
          const loginUrl = new URL("/login", request.nextUrl);
          loginUrl.searchParams.set("callbackUrl", pathname);
          return Response.redirect(loginUrl);
        }

        const needsBispado =
          pathname.startsWith("/bispado/agendas-sacramentais") &&
          !pathname.startsWith("/bispado/agendas-sacramentais/public");

        if (needsBispado && role !== "BISPADO") {
          return Response.redirect(new URL("/bispado", request.nextUrl));
        }
      }

      if (pathname === "/login" && isLoggedIn) {
        return Response.redirect(new URL("/bispado", request.nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "BISPADO";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;
