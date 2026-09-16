// Absolute site origin for metadata and structured data. On Vercel this is
// the project's production domain, which becomes the custom domain once one
// is added; locally it falls back to the dev server.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = new URL(host ? `https://${host}` : "http://localhost:3000");
