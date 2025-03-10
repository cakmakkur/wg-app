declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null; // This is the custom property "username"
      newsletter?: boolean | null;
    };
  }
}
