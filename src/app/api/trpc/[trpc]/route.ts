import { appRouter } from "@/trpcServer/project";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";


const isAllowedOrigin = (origin: string): boolean => {
  try {
    const url = new URL(origin);
    return (
      url.hostname.endsWith(".vercel.app") ||
      url.hostname === "localhost" ||         
      url.hostname === "127.0.0.1" ||
      url.hostname === process.env.PRODUCTION_DOMAIN
    );
  } catch {
    return false;
  }
};

const getCorsHeaders = (origin: string) => {
  const allowOrigin = isAllowedOrigin(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    headers,
  });
};

export { handler as GET, handler as POST, handler as OPTIONS };
