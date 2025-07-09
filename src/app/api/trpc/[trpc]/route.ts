import { appRouter } from "@/trpcServer/project";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// Configure allowed origins
const ALLOWED_ORIGINS = [
  // Production domains
  "https://your-production-domain.com",
  
  // Vercel preview patterns (include your main domain pattern)
  "https://*.vercel.app",
  "https://your-app-name-*.vercel.app"
];

if (process.env.NODE_ENV === "development") {
  ALLOWED_ORIGINS.push(
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  );
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin') || '';
  
  // Check if the origin is allowed
  const isAllowedOrigin = ALLOWED_ORIGINS.some(allowed => {
    // Exact match or wildcard domain match
    return origin === allowed || 
           (allowed.startsWith("*") && origin.endsWith(allowed.slice(1)));
  });

  // Prepare CORS headers
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, trpc-batch-mode",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // 24 hours
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // Handle tRPC requests
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

  // Add CORS headers to the response
  const headers = new Headers(response.headers);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    headers,
  });
};

export { handler as GET, handler as POST, handler as OPTIONS };