import { appRouter } from "@/trpcServer/project";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_FRONTEND_URL,
];

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin") || "";

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

  const headers = new Headers(response.headers);
  headers.set(
    "Access-Control-Allow-Origin",
    ALLOWED_ORIGINS.includes(origin) ? origin : ""
  );
  headers.set("Access-Control-Allow-Credentials", "true");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
};

export { handler as GET, handler as POST, handler as OPTIONS };
