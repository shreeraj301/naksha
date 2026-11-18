/* The address the site is served from. Set SITE_URL on the host; on Vercel the production address is used. */
export const SITE_URL = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://127.0.0.1:4401")).replace(/\/$/, "");
