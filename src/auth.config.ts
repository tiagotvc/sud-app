import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [],
  pages: {
    signIn: "/bispado/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role as string | undefined;

      if (pathname === "/login") {
        return Response.redirect(new URL("/calendario", request.nextUrl));
      }

      if (pathname === "/bispado/login") {
        if (isLoggedIn) {
          return Response.redirect(new URL("/bispado", request.nextUrl));
        }
        return true;
      }

      if (pathname.startsWith("/bispado")) {
        if (!isLoggedIn) {
          const loginUrl = new URL("/bispado/login", request.nextUrl);
          loginUrl.searchParams.set("callbackUrl", pathname);
          return Response.redirect(loginUrl);
        }

        const needsBispado =
          pathname.startsWith("/bispado/agendas-sacramentais") &&
          !pathname.startsWith("/bispado/agendas-sacramentais/public");

        if (needsBispado && role !== "BISPADO") {
          return Response.redirect(new URL("/bispado", request.nextUrl));
        }

        const needsComunicacao = pathname.startsWith("/bispado/comunicacao");
        if (needsComunicacao && role === "CONSELHEIRO") {
          return Response.redirect(new URL("/bispado/entrevistas", request.nextUrl));
        }

        const needsGestorConselheiros =
          pathname.startsWith("/bispado/entrevistas/conselheiros");
        if (needsGestorConselheiros && role !== "BISPADO" && role !== "ADMIN") {
          return Response.redirect(new URL("/bispado/entrevistas", request.nextUrl));
        }
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
        session.user.role = token.role as "ADMIN" | "BISPADO" | "CONSELHEIRO";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;
